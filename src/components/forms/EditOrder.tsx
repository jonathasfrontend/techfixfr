import { Plus, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from "../../services/api";
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';

interface Categoria {
    id: number;
    categoria: string;
}

interface Status {
    id: number;
    status: string;
}

export function EditOrder() {
    const { cpf } = useParams();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [ordemGetId, setOrdemGetId] = useState<Status[]>([]);
    const [formData, setFormData] = useState({
        info_produto: '',
        defeito: '',
        solucao: '',
        categoria: '',
        status: '',
        orcamento: ''
    });

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/categoria');
                setCategorias(response.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
    
        const fetchStatus = async () => {
            try {
                const response = await api.get('/status');
                setStatus(response.data);
            } catch (error) {
                console.error('Erro ao buscar status:', error);
            }
        };
    
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/produto/${cpf}`);
                console.log('Resposta de produto:', response.data);
                const ordemId = response.data.ordens.id;
                setOrdemGetId(ordemId);
                fetchOrderDetails(ordemId);
            } catch (error) {
                console.error('Erro ao buscar ordem:', error);
            }
        };     
    
        const fetchOrderDetails = async (ordemId: number) => {
            if (!ordemId) {
                console.error('ordemId é indefinido!');
                return; // Adicione uma verificação para evitar chamadas de API com ordemId indefinido
            }
            try {
                const response = await api.get(`/cliente/${cpf}/ordem/${ordemId}`);
                setFormData({
                    info_produto: response.data.ordem.info_produto,
                    defeito: response.data.ordem.defeito,
                    solucao: response.data.ordem.solucao,
                    categoria: response.data.ordem.categoria,
                    status: response.data.ordem.status,
                    orcamento: response.data.ordem.orcamento
                });
            } catch (error) {
                console.error('Erro ao buscar detalhes da ordem:', error);
            }
        };
        
    
        fetchCategorias();
        fetchStatus();
        fetchOrder(); // Chame fetchOrder primeiro
    }, [cpf]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function notify() {
        toast.success('Ordem atualizada com sucesso!');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const selectedCategoria = categorias.find((cat) => cat.categoria === formData.categoria);
            const selectedStatus = status.find((st) => st.status === formData.status);

            if (!selectedCategoria || !selectedStatus) {
                throw new Error('Categoria ou Status inválido');
            }

            const updatedOrder = {
                ...formData,
                fk_categoria_id: selectedCategoria.id,
                fk_status_id: selectedStatus.id
            };

            await api.put(`/cliente/${cpf}/ordem/${ordemGetId}`, updatedOrder);
            notify();

        } catch (error) {
            console.error('Erro ao atualizar a ordem:', error);
            alert('Erro ao atualizar a ordem.');
        }
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/40 inset-0 fixed backdrop-blur-sm" />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <Dialog.Content className="bg-[#152722] fixed px-8 py-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg w-[50em] h-[90%] shadow-lg shadow-black/25">
                <Dialog.Title className="text-5xl text-white font-black inter">Editar Ordem</Dialog.Title>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto mt-5">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="info_produto" className='text-lg font-semibold'>Informações do produto</label>
                        <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" value={formData.info_produto} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="defeito" className='text-lg font-semibold'>Relato do cliente</label>
                        <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" value={formData.defeito} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="solucao" className='text-lg font-semibold'>Diagnóstico e serviço a ser prestado</label>
                        <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" value={formData.solucao} onChange={handleChange} />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col w-full">
                            <label htmlFor="categoria" className='text-lg font-semibold'>Categoria</label>
                            <select
                                name="categoria"
                                id="categoria"
                                required
                                className="bg-[#00140D] text-lg py-4 px-5 rounded-lg outline-none"
                                value={formData.categoria}
                                onChange={handleChange}
                            >
                                <option disabled value="">Selecione a categoria do dispositivo</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.categoria}>
                                        {categoria.categoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-full">
                            <label htmlFor="status" className='text-lg font-semibold'>Status</label>
                            <select
                                name="status"
                                id="status"
                                required
                                className="bg-[#00140D] text-lg py-4 px-5 rounded-lg outline-none"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option disabled value="">Selecione o status do dispositivo</option>
                                {status.map((st) => (
                                    <option key={st.id} value={st.status}>
                                        {st.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="orcamento" className='text-lg font-semibold'>Orçamento</label>
                        <Input name="orcamento" id="orcamento" required placeholder="R$" value={formData.orcamento} onChange={handleChange} />
                    </div>

                    <footer className="mt-4 flex items-center justify-end gap-4">
                        <button type='submit'
                            className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600"
                        >
                            <Plus size={20} className='mr-1' />
                            Atualizar
                        </button>
                        <Dialog.Close type="button" className="bg-zinc-500 px-5 h-10 rounded-md font-semiBold  hover:bg-zinc-600">Cancelar</Dialog.Close>
                    </footer>

                </form>

                <Dialog.Close asChild>
                    <button className="rounded-full h-7 w-7 inline-flex items-center justify-center absolute top-8 right-8" aria-label="Close">
                        <X size={32} />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    );
}
