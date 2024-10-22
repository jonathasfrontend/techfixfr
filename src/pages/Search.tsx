import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { api } from '../services/api';
import { AddNew } from '../components/forms/AddNew';
import { useLocation } from 'react-router-dom';


export default function Search() {

    const navigate = useNavigate();
  
    const [searchTerm, setSearchTerm] = useState(''); 
  
    useEffect(() => {
      const { "nextauth.token": token } = parseCookies();
      if (!token) {
        navigate('/');
      } else {
        navigate('/search');
      }
    }, [navigate]);
  
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (searchTerm.trim()) {
        try {
          const response = await api.get(`/pesquisa/${searchTerm}`);
          
          navigate('/search', { state: { results: response.data } });
        } catch (error) {
          console.error("Erro ao realizar a pesquisa:", error);
        }
      }
    };

  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <div className='min-h-screen bg'>

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

      <h1>Resultados da Pesquisa</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result: any) => (
            <li key={result.id}>
              <p>Nome: {result.nome}</p>
              <p>CPF: {result.cpf}</p>
              <p>Telefone: {result.telefone}</p>
              <p>Data: {result.data}</p>
              <p>Status: {result.fk_status_id}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}
