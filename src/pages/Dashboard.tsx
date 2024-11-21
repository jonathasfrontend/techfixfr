import { useEffect, useState } from 'react';
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import * as Menubar from "@radix-ui/react-menubar";
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
    <div className='min-h-screen bg main_dashboard'>
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

      <header className='w-full flex items-center justify-between px-16 py-3 header_dashboard'>
        <div className='w-1/2 flex items-center'>
          <Menubar.Root className="flex items-center justify-center">
            <Menubar.Menu>
              <Menubar.Trigger className="">
                <img src={logo} className='w-10 h-10 rounded-full border-[2px] mr-3 border-solid border-green-600' alt="" />
              </Menubar.Trigger>

              <Menubar.Portal>
                <Menubar.Content
                  className="min-w-[220px] rounded-md bg-[#3d3d3d] text-white p-2 shadow-2xl"
                  sideOffset={5}
                  alignOffset={-3}
                >
                  <Menubar.Item className="h-7 flex items-center rounded hover:bg-[#2b2b2b] p-2 cursor-pointer" onClick={handleSignOut}>
                    <SignOut size={24} />
                    <div className="ml-auto pl-5 text-mauve9 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                      Sair
                    </div>
                  </Menubar.Item>
                </Menubar.Content>
              </Menubar.Portal>

            </Menubar.Menu>
          </Menubar.Root>

          <h1 className='text-2xl text-white font-bold'>Dashboard</h1>
        </div>

        <div className='flex items-center justify-between'>
          <div className='form_search_dashboard'>
            <FormSearch />
          </div>

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

      <div className="relative mt-3 w-full overflow-auto grid-cols-4 grid gap-2 px-16 card_items_dashboard" style={{ maxHeight: "calc(100vh - 6rem)" }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.cliente.id}
              id={order.cliente.id}
              nome={order.cliente.nome}
              telefone={order.cliente.telefone}
              cpf={order.cliente.cpf}
              fk_status_id={order.ordens[0]?.fk_status_id}
              data={order.ordens[0]?.data}
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
