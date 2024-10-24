import { MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function FormSearch() {
    const navigate = useNavigate();
  
    const [searchTerm, setSearchTerm] = useState(''); 

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

    return (
        <form
            className='w-[330px] h-[35px] bg-[#ffffff3c] rounded-full overflow-hidden flex items-center border-[1px] border-solid border-white'
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
    );
}