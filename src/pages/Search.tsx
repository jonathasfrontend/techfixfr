import { useEffect } from 'react';
import { parseCookies } from "nookies";
import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { CaretLeft, Plus } from '@phosphor-icons/react';
import { AddNew } from '../components/forms/AddNew';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.jpg';
import FormSearch from '../components/forms/FormSearch';


export default function Search() {

    const navigate = useNavigate();
  
    useEffect(() => {
      const { "nextauth.token": token } = parseCookies();
      if (!token) {
        navigate('/');
      } else {
        return;
      }
    }, [navigate]);

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
        <div className='w-1/2 flex items-center'>
          <Link to={'/dashboard'}>
            <div className="bg-white mr-5 p-3 rounded-lg hover:bg-[#ffffffc6]" >
              <CaretLeft size={24} />
            </div>
          </Link>
          <img src={logo} className='w-10 h-10 rounded-full border-[2px] mr-3 border-solid border-green-600' alt="" />
          <h1 className='text-2xl text-white font-bold'>Pesquisa</h1>
        </div>

        <div className='flex items-center justify-between'>
          <FormSearch />

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

      <div className='relative mt-3 w-full overflow-auto px-16 flex flex-col gap-3'>
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