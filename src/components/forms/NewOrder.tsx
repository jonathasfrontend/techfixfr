import { Plus, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bounce, ToastContainer, toast } from 'react-toastify';
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
    const [formData, setFormData] = useState({
        id:'',
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

        fetchCategorias();
        fetchStatus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      function notify(){
        toast.success('Formulario enviado com sucesso!')
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
    
          await api.post(`cliente/${newOrder.id}/ordem`, newOrder);
          setFormData({
            id: '',
            info_produto: '',
            defeito: '',
            solucao: '',
            categoria: '',
            status: '',
            orcamento: ''
          });
          notify()
    
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

        <Dialog.Content className="bg-[#152722] fixed px-8 py-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg w-[50em] h-[90%] shadow-lg shadow-black/25">
        <Dialog.Title className="text-5xl text-white font-black inter">Nova Ordem</Dialog.Title>
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
                        <label htmlFor="category" className='text-lg font-semibold'>Categoria</label>
                        <select
                            name="categoria"
                            id="category"
                            required
                            className="bg-[#00140D] text-base py-4 px-5 rounded-lg outline-none"
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
                            className="bg-[#00140D] text-base py-4 px-5 rounded-lg outline-none"
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
                        <Plus size={20} className='mr-1'/>
                        Criar
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
    )
}