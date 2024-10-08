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

interface Ordem {
    id: string;
    info_produto: string;
    defeito: string;
    solucao: string;
    categoria: string;
    status: string;
    orcamento: string;
}

export function EditOrder() {
    const { cpf } = useParams();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [statusList, setStatus] = useState<Status[]>([]);
    const [ordens, setOrdens] = useState<Ordem[]>([]);
    const [selectedOrdem, setSelectedOrdem] = useState<Ordem | null>(null);

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

        const fetchOrdens = async () => {
            try {
                const response = await api.get(`/produto/${cpf}`);
                setOrdens(response.data.ordens);
            } catch (error) {
                console.error('Erro ao buscar ordens:', error);
            }
        };
    
        fetchCategorias();
        fetchStatus();
        fetchOrdens();
    }, [cpf]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (selectedOrdem) {
            const { name, value } = e.target;
            setSelectedOrdem((prev) => prev ? { ...prev, [name]: value } : null);
        }
    };

    function notifySuccess() {
        toast.success('Ordem atualizada com sucesso!');
    }
    
    function notifyError() {
        toast.error('Erro ao atualizar ordem!');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        if (!selectedOrdem) return;

        const { id, categoria, status, ...formData } = selectedOrdem;

        try {
            const selectedCategoria = categorias.find((cat) => cat.categoria === categoria);
            const selectedStatus = statusList.find((st) => st.status === status);
   
            if (!selectedCategoria || !selectedStatus) {
                throw new Error('Categoria ou Status inválido');
            }

            const updatedOrder = {
                ...formData,
                fk_categoria_id: selectedCategoria.id,
                fk_status_id: selectedStatus.id,
            };
            
            // Atualiza a ordem usando o ID da ordem selecionada
            await api.put(`/cliente/${cpf}/ordem/${id}`, updatedOrder);
            console.log('Ordem atualizada:', updatedOrder, `/cliente/${cpf}/ordem/${id}`);

            notifySuccess();
        } catch (error) {
            console.error('Erro ao atualizar a ordem:', error);
            notifyError();
        }
    };

    const handleEdit = (ordem: Ordem) => {
        setSelectedOrdem(ordem); // Define a ordem selecionada
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

                <div className="w-full flex mt-5">
                    {ordens.map((ordem) => (
                        <button onClick={() => handleEdit(ordem)} key={ordem.id} className='p-3 bg-[#00140D] flex items-center justify-center rounded-lg mr-2 hover:bg-[#00140d82] text-sm'>
                            {ordem.info_produto}
                        </button>
                    ))}
                </div>

                {selectedOrdem && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto mt-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="info_produto" className='text-lg font-semibold'>Informações do produto</label>
                            <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" value={selectedOrdem.info_produto} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="defeito" className='text-lg font-semibold'>Relato do cliente</label>
                            <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" value={selectedOrdem.defeito} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="solucao" className='text-lg font-semibold'>Diagnóstico e serviço a ser prestado</label>
                            <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" value={selectedOrdem.solucao} onChange={handleChange} />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex flex-col w-full">
                                <label htmlFor="categoria" className='text-lg font-semibold'>Categoria</label>
                                <select
                                    name="categoria"
                                    id="categoria"
                                    required
                                    className="bg-[#00140D] text-lg py-4 px-5 rounded-lg outline-none"
                                    value={selectedOrdem.categoria}
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
                                    value={selectedOrdem.status}
                                    onChange={handleChange}
                                >
                                    <option disabled value="">Selecione o status do dispositivo</option>
                                    {statusList.map((st) => (
                                        <option key={st.id} value={st.status}>
                                            {st.status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="orcamento" className='text-lg font-semibold'>Orçamento</label>
                            <Input name="orcamento" id="orcamento" required placeholder="R$" value={selectedOrdem.orcamento} onChange={handleChange} />
                        </div>

                        <footer className="mt-4 flex items-center justify-end gap-4">
                            <button type='submit'
                                className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600"
                            >
                                <Plus size={20} className='mr-1' />
                                Atualizar
                            </button>
                            <Dialog.Close asChild>
                                <button className="bg-red-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-red-600">
                                    <X size={20} className='mr-1' />
                                    Fechar
                                </button>
                            </Dialog.Close>
                        </footer>
                    </form>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    );
}
