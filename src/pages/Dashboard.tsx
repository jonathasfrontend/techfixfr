import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { CircleNotch, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { AddNew } from '../components/forms/AddNew';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ClienteData {
  cliente: {
    cpf: string;
    nome: string;
    telefone: string;
  }
}

interface OrdemData {
  id: string;
  data: string;
  fk_status_id: number;
}
interface Order extends ClienteData, OrdemData {}

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');  // Estado para capturar o valor de pesquisa
  const [orders, setOrder] = useState<Order[]>([]);

  // Verificação de autenticação
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Busca das últimas ordens
  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/ultimas-ordens');
        setOrder(response.data);
      } catch (error) {
        toast.error('Erro ao carregar as últimas ordens');
      }
    }
    getOrders();
  }, []);


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.info('Por favor, insira um termo de pesquisa válido');
      return;
    }

    try {
      const response = await api.get(`/pesquisa/${searchTerm}`);
      
      if (response.data.length === 0) {
        toast.warn('Nenhum cliente encontrado com essas informações');
      } else {
        navigate('/search', { state: { results: response.data } });
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.warn('Cliente não encontrado');
            break;
          case 500:
            toast.error('Erro no servidor, tente novamente mais tarde');
            break;
          default:
            toast.error('Erro desconhecido, tente novamente');
        }
      }
    }
  };

  return (
    <div className='min-h-screen bg'>
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

      <header className='w-full flex items-center justify-between px-16 py-3'>
        <div className='w-1/2'>
          <h1 className='text-2xl text-white font-bold'>Tech fix FR Dashboard</h1>
        </div>

        <div className='flex items-center justify-between'>
          <form
            className='w-[330px] h-[38px] bg-[#ffffff3c] rounded-full overflow-hidden flex items-center border-[1px] border-solid border-white'
            onSubmit={handleSearch} 
          >
            <input 
              className='w-full h-full bg-[#ffffff00] rounded-full outline-none px-3 font-medium text-sm placeholder:text-[#ffffff9f] text-white'
              type="search"
              id="search"
              name="search"
              autoComplete="off"
              placeholder="Pesquise... (CPF) (Nome) (Telefone)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type='submit' className='w-14 h-full bg-[#ffffff3c] flex items-center justify-center hover:bg-[#ffffff75]'>
              <MagnifyingGlass className=' w-5 h-full text-white' />
            </button>
          </form>

          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild className='cursor-pointer'>
                <button className='p-3 bg-[#2FB600] flex items-center justify-center rounded-lg ml-5 hover:bg-[#2eb600d8] outline-none'>
                  <Plus className='w-6 h-6 text-white' />
                </button>
              </Dialog.Trigger>
              <AddNew />
            </Dialog.Root>
          </div>
        </div>
      </header>

      <div className="relative mt-3 w-full overflow-auto grid-cols-4 grid gap-2 px-16" style={{ maxHeight: "calc(100vh - 6rem)" }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              id={order.id}
              nome={order.cliente.nome}
              telefone={order.cliente.telefone}
              cpf={order.cliente.cpf}
              fk_status_id={order.fk_status_id}
              data={order.data}
            />
          ))
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <CircleNotch className='animate-spin text-green-600' size={32} />
          </div>
        )}
      </div>
    </div>
  );
}
