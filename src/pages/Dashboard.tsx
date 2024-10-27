import { useEffect, useState } from 'react';
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { CircleNotch, Plus, SignOut } from '@phosphor-icons/react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { AddNew } from '../components/forms/AddNew';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.jpg';
import FormSearch from '../components/forms/FormSearch';

interface ClienteData {
  cliente: {
    id: string;
    cpf: string;
    nome: string;
    telefone: string;
  }
}

interface OrdemData {
  ordens:[
    {
      id: string;
      data: string;
      fk_status_id: number;
    }
  ]
}
interface Order extends ClienteData, OrdemData {}

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrder] = useState<Order[]>([]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

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

  const handleSignOut = () => {
    destroyCookie(null, "nextauth.token");
    navigate('/');
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
        <div className='w-1/2 flex items-center'>
          <button className="bg-white mr-5 p-3 rounded-lg hover:bg-[#ffffffc6]" onClick={handleSignOut}>
              <SignOut size={24} />
          </button>
          <img src={logo} className='w-10 h-10 rounded-full border-[2px] mr-3 border-solid border-green-600' alt="" />
          <h1 className='text-2xl text-white font-bold'>Dashboard</h1>
        </div>

        <div className='flex items-center justify-between'>
          <FormSearch />

          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild className='cursor-pointer'>
                <button className='p-3 bg-[#2FB600] flex items-center justify-center rounded-md ml-5 hover:bg-[#2eb600d8] outline-none'>
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
              key={order.cliente.id}
              id={order.cliente.id}
              nome={order.cliente.nome}
              telefone={order.cliente.telefone}
              cpf={order.cliente.cpf}
              fk_status_id={order.ordens[0]?.fk_status_id}  // Acessando o primeiro item de 'ordens'
              data={order.ordens[0]?.data}                  // Acessando o primeiro item de 'ordens'
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
