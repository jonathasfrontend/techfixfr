import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { api } from '../services/api';
import { AddNew } from '../components/forms/AddNew';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Search() {

    const navigate = useNavigate();
  
    const [searchTerm, setSearchTerm] = useState(''); 
  
    useEffect(() => {
      const { "nextauth.token": token } = parseCookies();
      if (!token) {
        navigate('/');
      } else {
        return;
      }
    }, [navigate]);
  
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
          }
        }
      }
    };

  const location = useLocation();
  const { results } = location.state || { results: [] };

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
          <h1 className='text-2xl text-white font-bold'>Tech fix FR Pesquisa</h1>
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

      <div className='relative mt-3 w-full overflow-auto px-16'>
        <h1 className='font-medium mb-3 text-1xl text-[#b6b6b6]'>Resultados da Pesquisa</h1>
        
        {results.map((result: any) => (

          result.ordem.length > 0 && (
            result.ordem.map((ordem: any) => (
              <Card
                key={ordem.id}
                id={ordem.id}
                nome={result.nome}
                telefone={result.telefone}
                cpf={result.cpf}
                data={ordem.data}
                fk_status_id={ordem.fk_status_id}
              />
            ))
          )
        )) || (
          <p className='font-medium mb-3 text-1xl text-[#ff4242]'>Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  );
}