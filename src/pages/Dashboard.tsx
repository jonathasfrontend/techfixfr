import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus } from '@phosphor-icons/react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { AddNew } from '../components/forms/AddNew';

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
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const [orders, setOrder] = useState<Order[]>([]);

  useEffect(()=>{
    async function getOders(){
      const response = await api.get('/ultimas-ordens')
      const reversedOrders = response.data;
      setOrder(reversedOrders);
    }
    getOders()
  }, [])

  return (
    <div className='min-h-screen bg'>

      <header className='w-full flex items-center justify-between px-16 py-3'>
        <div className='w-1/2'>
          <h1 className='text-2xl text-white font-bold'>Tech fix FR Dashboard</h1>
        </div>

        <div className='flex items-center justify-between'>
          <div className='w-[280px]'>
            <input 
            className='w-full h-[35px] bg-[#ffffff3c] rounded-full border-[1px] border-solid border-white outline-none px-3 font-medium text-sm placeholder:text-white text-white'
            type="search"
            id="search"
            name="search"
            autoComplete="off"
            placeholder="Pesquise..."
            />
          </div>
          <div>
          <Dialog.Root> 
            <Dialog.Trigger asChild className='cursor-pointer'>
              <button className='p-3 bg-[#2FB600] flex items-center justify-center rounded-lg ml-5 hover:bg-[#2eb600d8]'>
                <Plus className='w-6 h-6 text-white' />
              </button>
            </Dialog.Trigger>
            <AddNew />
          </Dialog.Root>
          </div>
        </div>
      </header>

      <div className="relative mt-3 w-full overflow-auto grid-cols-4 grid gap-2 px-16" style={{ maxHeight: "calc(100vh - 6rem)" }}>
        {orders.map(order => {
            return (
              <Card
                key={order.cliente.cpf}
                id={order.cliente.cpf} 
                nome={order.cliente.nome}
                telefone={order.cliente.telefone}
                cpf={order.cliente.cpf}
                fk_status_id={order.fk_status_id}
                data={order.data}
              />
            ) 
          })}
        </div>

    </div>
  );
}
