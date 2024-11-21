import * as Dialog from '@radix-ui/react-dialog';
import { CurrencyDollar, Plus, X } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from "../../services/api";
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { formatCurrency } from '../../services/formatters'

interface Status {
    id: number;
    status: string;
}

interface Ordem {
    id: string;
    info_produto: string;
    defeito: string;
    solucao: string;
    fk_status_id: number;
    orcamento: string;
}

export function EditOrder() {
    const { id: idCliente } = useParams();
    const [statusList, setStatusList] = useState<Status[]>([]);
    const [ordens, setOrdens] = useState<Ordem[]>([]);
    const [selectedOrdem, setSelectedOrdem] = useState<Ordem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statusResponse, ordemResponse] = await Promise.all([
                    api.get('/status'),
                    api.get(`/produto/${idCliente}`)
                ]);
                setStatusList(statusResponse.data);
                setOrdens(ordemResponse.data.ordens);
    
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, [idCliente]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (selectedOrdem) {
            const { name, value } = e.target;

            const formattedValue = 
                name === "orcamento" ? formatCurrency(value) : value;

            setSelectedOrdem((prev) => 
                prev ? { ...prev, [name]: name === "fk_status_id" ? Number(value) : formattedValue } : null
            );
        }
    };

    const notifySuccess = () => toast.success('Ordem atualizada com sucesso!');
    const notifyError = () => toast.error('Erro ao atualizar ordem!');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedOrdem) return;

        const { id: idOrdem, fk_status_id, ...formData } = selectedOrdem;

        try {
            const selectedStatus = statusList.find((st) => st.id === fk_status_id);
   
            if (!selectedStatus) {
                console.error('Status inválido:', fk_status_id);
                throw new Error('Status inválido');
            }

            const updatedOrder = {
                ...formData,
                fk_status_id,
                orcamento: selectedOrdem.orcamento.replace(/[^\d]/g, ""),
            };
            
            await api.put(`/cliente/${idCliente}/ordem/${idOrdem}`, updatedOrder);
            
            notifySuccess();
        } catch (error) {
            console.error('Erro ao atualizar a ordem:', error);
            notifyError();
        }
    };

    const handleEdit = (ordem: Ordem) => {
        setSelectedOrdem({
            ...ordem,
            orcamento: formatCurrency(ordem.orcamento), // Formata o orçamento ao carregar os dados
        });
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/40 inset-0 fixed backdrop-blur-sm" />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} transition={Bounce} theme="light" />

            <Dialog.Content
                className="bg-[#152722] fixed px-8 py-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md h-[90%] w-[480px] shadow-lg shadow-black/25 main_form_style"
                aria-describedby="edit-order-dialog"    
            >
                <Dialog.Title className="text-3xl text-white font-black inter">Editar Ordem</Dialog.Title>

                <div className="w-full flex mt-5">
                    {ordens.map((ordem) => (
                        <button onClick={() => handleEdit(ordem)} key={ordem.id} className='p-3 bg-[#00140D] flex items-center justify-center rounded-md mr-2 hover:bg-[#00140d82] text-sm outline-none'>
                            {ordem.info_produto}
                        </button>
                    ))}
                </div>

                {selectedOrdem && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto mt-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="info_produto">Informações do produto</label>
                            <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" value={selectedOrdem.info_produto} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="defeito">Relato do cliente</label>
                            <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" value={selectedOrdem.defeito} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="solucao">Diagnóstico e serviço a ser prestado</label>
                            <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" value={selectedOrdem.solucao} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col w-full">
                            <label htmlFor="fk_status_id">Status</label>
                            <select
                                name="fk_status_id"
                                id="fk_status_id"
                                required
                                className="bg-[#00140D] text-sm py-4 px-5 w-full rounded-md outline-none"
                                value={selectedOrdem.fk_status_id}
                                onChange={handleChange}
                            >
                                {statusList.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="orcamento">Orçamento</label>
                            <div className='bg-[#00140D] flex items-center overflow-hidden rounded-md'>
                                <div className='px-2'>
                                    <CurrencyDollar className='w-5 h-5 '/>
                                </div>
                                    <input
                                    className='bg-[#00140D] text-sm w-full py-4 pr-5 outline-none placeholder:text-[#71717A]'
                                    name="orcamento"
                                    id="orcamento"
                                    required
                                    placeholder="R$ 0,00"
                                    value={selectedOrdem.orcamento}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <footer className="mt-4 flex items-center justify-end gap-4">
                            <button type='submit' className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600 outline-none">
                                <Plus size={20} className='mr-1' />
                                Atualizar
                            </button>
                            <Dialog.Close asChild>
                                <button className="bg-red-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-red-600 outline-none">
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
