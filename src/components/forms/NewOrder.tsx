import { CurrencyDollar, Plus, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from "../../services/api";
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';
import 'react-toastify/dist/ReactToastify.css';

interface Categoria {
    id: number;
    categoria: string;
}

interface Status {
    id: number;
    status: string;
}

export function NewOrder() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [idCliente, setIdCliente] = useState<string>('');
    const [formData, setFormData] = useState({
        info_produto: '',
        defeito: '',
        solucao: '',
        categoria: '',
        status: '',
        orcamento: ''
    });

    const { id } = useParams();

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
        
        const fetchIdCliente = async () => {
            try {
                const response = await api.get(`/produto/${id}`);
                setIdCliente(response.data.cliente.id);
            } catch (error) {
                console.error('Erro ao buscar CPF do cliente:', error);
            }
        };

        fetchCategorias();
        fetchStatus();
        fetchIdCliente();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function notify() {
        toast.success('Nova ordem de serviço criada com sucesso!');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const selectedCategoria = categorias.find((cat) => cat.categoria === formData.categoria);
            const selectedStatus = status.find((st) => st.status === formData.status);

            if (!selectedCategoria || !selectedStatus) {
                throw new Error('Categoria ou Status inválido');
            }

            const newOrder = {
                ...formData,
                fk_categoria_id: selectedCategoria.id,
                fk_status_id: selectedStatus.id
            };

            // Usando o CPF obtido para cadastrar a nova ordem
            await api.post(`cliente/${idCliente}/ordem`, newOrder);
            setFormData({
                info_produto: '',
                defeito: '',
                solucao: '',
                categoria: '',
                status: '',
                orcamento: ''
            });
            notify();

        } catch (error) {
            console.error('Erro ao cadastrar cliente e ordem:', error);
            alert('Erro ao cadastrar.');
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

            <Dialog.Content className="bg-[#152722] fixed px-8 py-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md h-[90%] w-[480px] shadow-lg shadow-black/25">
                <Dialog.Title className="text-3xl text-white font-black inter">Nova Ordem</Dialog.Title>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto mt-5">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="info_produto">Informações do produto</label>
                        <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" value={formData.info_produto} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="defeito">Relato do cliente</label>
                        <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" value={formData.defeito} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="solucao">Diagnóstico e serviço a ser prestado</label>
                        <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" value={formData.solucao} onChange={handleChange} />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col w-full">
                            <label htmlFor="category">Categoria</label>
                            <select
                                name="categoria"
                                id="category"
                                required
                                className="bg-[#00140D] w-full text-sm py-4 px-5 rounded-md outline-none"
                                value={formData.categoria}
                                onChange={handleChange}
                            >
                                <option disabled value="">Selecione a categoria</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.categoria}>
                                        {categoria.categoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-full">
                            <label htmlFor="status">Status</label>
                            <select
                                name="status"
                                id="status"
                                required
                                className="bg-[#00140D] w-full text-sm py-4 px-5 rounded-md outline-none"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option disabled value="">Selecione o status</option>
                                {status.map((st) => (
                                    <option key={st.id} value={st.status}>
                                        {st.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="orcamento">Orçamento</label>
                        <div className='bg-[#00140D] flex items-center overflow-hidden rounded-md'>
                            <div className='px-2'>
                                <CurrencyDollar className='w-5 h-5 '/>
                            </div>
                            <input className='bg-[#00140D] text-sm w-full py-4 pr-5 outline-none placeholder:text-[#71717A]' name="orcamento" id="orcamento" required placeholder="R$ 0,00" value={formData.orcamento} onChange={handleChange} />
                        </div>
                    </div>

                    <footer className="mt-4 flex items-center justify-end gap-4">
                        <button type='submit'
                            className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600 outline-none"
                        >
                            <Plus size={20} className='mr-1' />
                            Criar
                        </button>
                        <Dialog.Close type="button" className="bg-zinc-500 px-5 h-10 rounded-md font-semiBold  hover:bg-zinc-600">Cancelar</Dialog.Close>
                    </footer>

                </form>

                <Dialog.Close asChild>
                    <button className="rounded-full h-7 w-7 inline-flex items-center justify-center absolute top-8 right-8 outline-none" aria-label="Close">
                        <X size={32} />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    );
}
