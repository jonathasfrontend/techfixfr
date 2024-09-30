import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../services/api";
import { CaretLeft, CircleNotch, Plus } from '@phosphor-icons/react';
import { CardUserAccordion } from '../components/CardUserAccordion';
import { IconUser } from '../components/IconUser';
import * as Dialog from '@radix-ui/react-dialog';
import { NewOrder } from '../components/forms/NewOrder';

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


export default function User() {
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      api.get(`/produto/${id}`)
        .then(response => {
        setCliente(response.data.cliente);
        setOrdem(response.data.ordem);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching cliente details:", error);
      });
    }
  }, [id, navigate]);


  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [ordem, setOrdem] = useState<OrdemData | null>(null);

  useEffect(() => {
    api.get(`/produto/${id}`).then(response => {
        setCliente(response.data.cliente)
        setOrdem(response.data.ordem);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching cliente details:", error);
      });
  }, [id]);

  return (
    <div className='min-h-screen bg'>
      <header className='w-full flex items-center justify-between px-16 py-3'>
        <div className='w-1/2 flex items-center'>
          <a href="/dashboard">
            <div className="bg-white mr-5 p-3 rounded-lg hover:bg-[#ffffffc6]" >
                <CaretLeft size={24} />
            </div>
          </a>
          <h1 className='text-2xl flex items-center text-white font-bold'><IconUser />{cliente?.nome}</h1>
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
            <NewOrder />
          </Dialog.Root>
          </div>
        </div>
      </header>

      <div className="relative mt-3 w-full overflow-auto px-16" style={{ maxHeight: "calc(100vh - 6rem)" }}>

      {cliente && ordem ? (
        <CardUserAccordion
          key={ordem.id}
          cpf={cliente.cpf}
          nome={cliente.nome}
          endereco={cliente.endereco}
          telefone={cliente.telefone}
          id={ordem.id}
          data={ordem.data}
          info_produto={ordem.info_produto}
          defeito={ordem.defeito}
          solucao={ordem.solucao}
          garantia={ordem.garantia}
          fk_cliente_cpf={ordem.fk_cliente_cpf}
          fk_status_id={ordem.fk_status_id}
          fk_categoria_id={ordem.fk_categoria_id}
          orcamento={ordem.orcamento}
        />
        ) : (
          <div className='w-full flex items-center justify-center'>
            <CircleNotch className='animate-spin text-green-600' size={32} />
          </div>
      )}

      </div>
    </div>
  );
}


