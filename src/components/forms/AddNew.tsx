import { CurrencyDollar, Plus } from '@phosphor-icons/react';
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

export function AddNew() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    endereco: '',
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

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cpf') formattedValue = formatCPF(value);
    if (name === 'telefone') formattedValue = formatPhone(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
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

      // Remover formatação antes de enviar
      const unformattedData = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove todos os caracteres não numéricos
        telefone: formData.telefone.replace(/\D/g, ''), // Remove todos os caracteres não numéricos
        fk_categoria_id: selectedCategoria.id,
        fk_status_id: selectedStatus.id
      };

      await api.post('/cliente-e-ordem', unformattedData);
      setFormData({
        nome: '',
        telefone: '',
        cpf: '',
        endereco: '',
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
        <Dialog.Title className="text-3xl text-white font-black Inter">Adicionar novo cliente</Dialog.Title>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto mt-5">


            <div className="flex flex-col gap-2">
              <label htmlFor="name" >Nome</label>
              <Input name="nome" id="name" required placeholder="Nome do cliente" value={formData.nome} onChange={handleChange} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="telefone">Telefone</label>
                <Input name="telefone" id="telefone" required placeholder="(42) 99999-9999" value={formData.telefone} onChange={handleChange} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="cpf">CPF</label>
                <Input name="cpf" id="cpf" required placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="endereco" >Endereço</label>
              <Input name="endereco" id="endereco" required placeholder="Endereço" value={formData.endereco} onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="info_produto" >Informações do produto</label>
              <Input name="info_produto" id="info_produto" required placeholder="Informações do produto" value={formData.info_produto} onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="defeito" >Relato do cliente</label>
              <Textarea name="defeito" id="defeito" required placeholder="Relato do cliente" value={formData.defeito} onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="solucao" >Diagnóstico e serviço a ser prestado</label>
              <Textarea name="solucao" id="solucao" required placeholder="Diagnóstico e serviço a ser prestado" value={formData.solucao} onChange={handleChange} />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="category" >Categoria</label>
              <select
                name="categoria"
                id="category"
                required
                className="bg-[#00140D] text-sm py-4 pl-5 rounded-md outline-none"
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
              <label htmlFor="status" >Status</label>
              <select
                name="status"
                id="status"
                required
                className="bg-[#00140D] text-sm py-4 pl-5 rounded-md outline-none"
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
              <button type='submit' className="bg-green-500 px-5 h-10 rounded-md font-semiBold flex items-center hover:bg-green-600 outline-none">
                <Plus size={20} className='mr-1' />
                Cadastrar
              </button>
              <Dialog.Close type="button" className="bg-zinc-500 px-5 h-10 rounded-md font-semiBold hover:bg-zinc-600">Cancelar</Dialog.Close>
            </footer>
          </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
