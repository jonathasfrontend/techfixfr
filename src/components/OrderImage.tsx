import { useLocation } from 'react-router-dom'; 
import { formatTelefone, formatDate, formatCurrency } from '../services/formatters';
import html2canvas from 'html2canvas';
import logo from '../assets/logo.jpg';

const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

interface OrderImageProps {
  orderData?: {
    id: string;
    data: string;
    info_produto: string;
    defeito: string;
    solucao: string;
    fk_cliente_cpf: string;
    fk_status_id: number;
    fk_categoria_id: number;
    orcamento: string;
    cpf: string;
    nome: string;
    endereco: string;
    telefone: string;
  };
}

export function OrderImage({ orderData }: OrderImageProps) {
  const { state } = useLocation();
  const orderDataFromState = state?.orderData;
  
  const finalOrderData = orderDataFromState || orderData;

  if (!finalOrderData) {
    return <p>Nenhuma ordem encontrada.</p>;
  }

  const captureImage = async () => {    
    setTimeout(async () => {
      const content = document.getElementById(`order-${finalOrderData.id}`);
      if (content) {
        const canvas = await html2canvas(content, {
          backgroundColor: '#ffffff',
          width: 730,
          height: 700,
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Ordem-${finalOrderData.id}.png`;
        link.click();
      }
    }, 500);
  };
  

  return (
    <div id={`order-${finalOrderData.id}`} className="min-h-screen w-[730px] px-5 bg-[#ffffff] border-r-[1px] border-[#ccc]">

      <header className='w-full flex-col flex items-center'>
        <h1 className='text-2xl text-[#121214] font-bold uppercase my-2'>Registro de Ordem de Serviço</h1>
        <div className='w-full flex items-center justify-between'>
          <div className='flex items-center'>
            <img src={logo} className='w-14 h-14 object-cover rounded-full border-[2px] mr-3 border-solid border-green-600' alt="" />
            <div>
              <p className='text-xl text-[#121214] font-bold'>Tech Fix FR</p>
              <p className='text-sm text-[#121214] font-normal'>CNPJ: 12.345.678/0001-00</p>
            </div>
          </div>
          <div className='text-[#121214] flex flex-col items-center'>
            <p className='text-sm font-extrabold'>O.S N°: <span className='text-sm font-normal'>{finalOrderData.id}</span></p>
            <p className='text-sm font-extrabold'>Data: <span className='text-sm font-normal'>{formatDate(finalOrderData.data)}</span></p>
          </div>
        </div>        
      </header>

      <div className='w-full my-5 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase mb-2'>Dados do cliente</h1>
        <div className='w-full flex items-center justify-between px-20 py-5 border-solid border-[1px] border-[#12121453]'>
          <div>
            <p className='text-base font-extrabold'>Nome: <span className='text-base font-normal'>{finalOrderData.nome}</span></p>
            <p className='text-base font-extrabold'>Endereço: <span className='text-base font-normal'>{finalOrderData.endereco}</span></p>
          </div>
          <div>
            <p className='text-base font-extrabold'>CPF: <span className='text-base font-normal'>{formatCpf(finalOrderData.cpf)}</span></p>
            <p className='text-base font-extrabold'>Telefone: <span className='text-base font-normal'>{formatTelefone(finalOrderData.telefone)}</span></p>
          </div>
        </div>
      </div>

      <div className='w-full flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase mb-2'>Informações do produto</h1>
        <div className='w-full flex items-center justify-between px-20 py-5 border-solid border-[1px] border-[#12121453]'>
          <p className='text-base font-extrabold'>Modelo: <span className='text-base font-normal'>{finalOrderData.info_produto}</span></p>
        </div>
      </div>

      <div className='w-full flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase mb-2'>Relato do Cliente</h1>
        <div className='w-full flex items-center justify-between px-20 py-5 border-solid border-[1px] border-[#12121453]'>
          <p className='text-base font-extrabold'><span className='text-base font-normal'>{finalOrderData.defeito}</span></p>
        </div>
      </div>

      <div className='w-full flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase mb-2'>Diagnóstico e Solução</h1>
        <div className='w-full flex items-center justify-between px-20 py-5 border-solid border-[1px] border-[#12121453]'>
          <p className='text-base font-extrabold'><span className='text-base font-normal'>{finalOrderData.solucao}</span></p>
        </div>
      </div>

      <div className='w-full flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase mb-2'>Orçamento</h1>
        <div className='w-full flex items-center justify-between px-20 py-5 border-solid border-[1px] border-[#12121453]'>
          <div className='w-full flex items-center justify-between'>
            <p className='text-base font-extrabold'>Total:</p>
            <span className='text-base font-normal'>{formatCurrency(finalOrderData.orcamento)}</span>
          </div>
        </div>
      </div>

      <button onClick={captureImage} className="absolute bottom-5 right-5 mt-4 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
          Gerar Imagem
      </button>
    </div>
  );
}
