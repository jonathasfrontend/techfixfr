import { Plus, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';

interface ClienteData {
    cpf: string;
    nome: string;
    endereco: string;
    telefone: string;
  }
  
  interface OrdemData {
    id: string;
    data: string;
    info_produto: string;
    defeito: string;
    solucao: string;
    garantia: string;
    fk_cliente_cpf: string;
    fk_status_id: number;
    fk_categoria_id: number;
    orcamento: string;
  }
  
  interface CardProps extends ClienteData, OrdemData {}

export function AddNew() {
    return (
    <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 inset-0 fixed backdrop-blur-sm" />

        <Dialog.Content className="bg-[#152722] fixed px-8 py-5 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg h-[98%] w-[50em] shadow-lg shadow-black/25">
        <Dialog.Title className="text-5xl text-white font-black Inter">Adicionar novo cliente</Dialog.Title>
        <form  className="flex flex-col gap-4 h-auto mt-5">

            <div className="flex flex-col gap-2">
                <label htmlFor="name" className='text-lg font-semibold'>Nome</label>
                <Input name="name" id="name" required placeholder="Nome do cliente " />
            </div>

            <div className="flex items-center gap-2">
                <div className="flex flex-col w-full">
                    <label htmlFor="telefone" className='text-lg font-semibold'>Telefone</label>
                    <Input name="telefone" id="telefone" required placeholder="(42) 99999-9999" />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="cpf" className='text-lg font-semibold'>CPF</label>
                    <Input name="cpf" id="cpf" required placeholder="000.000.000-00 " />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="endereco" className='text-lg font-semibold'>Endereço</label>
                <Input name="endereco" id="endereco" required placeholder="Endereço" />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="info_produto" className='text-lg font-semibold'>Informações do produto</label>
                <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="defeito" className='text-lg font-semibold'>Relato do cliente</label>
                <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="solucao" className='text-lg font-semibold'>Diagnóstico e serviço a ser prestado</label>
                <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" />
            </div>

            <div className="flex items-center gap-2">
                <div className="flex flex-col w-full">
                    <label htmlFor="category" className='text-lg font-semibold'> Categoria</label>
                    <select
                        name="category"
                        id="category"
                        required
                        className="bg-[#00140D] text-base py-4 px-5 rounded-lg outline-none placeholder:text-[#71717A] appearance-none"
                        defaultValue=""
                        >
                            <option disabled value="">Selecione a categoria do dispositivo</option>
                            <option >Aberto</option>
                    </select>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="status" className='text-lg font-semibold'>Status</label>
                    <select
                        name="status"
                        id="status"
                        required
                        className="bg-[#00140D] text-base py-4 px-5 rounded-lg outline-none placeholder:text-[#71717A] appearance-none"
                        defaultValue=""
                        >
                            <option disabled value="">Selecione o status do dispositivo</option>
                            <option >Em reparo</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="orcamento" className='text-lg font-semibold'>Orçamento</label>
                <Input name="orcamento" id="orcamento" required placeholder="R$" />
            </div>

            <footer className="mt-4 flex items-center justify-end gap-4">
                <button type='submit'
                className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600"
                >
                    <Plus size={20} className='mr-1'/>
                    Cadastrar
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