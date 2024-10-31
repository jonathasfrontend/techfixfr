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
  const orderDataFromState = state?.orderData; // Renomeie a variável aqui
  
  // Use a orderData passada como prop, ou a do estado se não estiver definida
  const finalOrderData = orderDataFromState || orderData;

  if (!finalOrderData) {
    return <p>Nenhuma ordem encontrada.</p>; // Exibir mensagem de erro se não houver dados
  }

  const captureImage = async () => {
    console.log('Botão clicado!');
    console.log('finalOrderData:', finalOrderData); 
    
    setTimeout(async () => {
      const content = document.getElementById(`order-${finalOrderData.id}`);
      if (content) {
        const canvas = await html2canvas(content, {
          backgroundColor: '#ffffff',
          width: 760, // Largura específica
          height: 480, // Altura específica
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Ordem-${finalOrderData.id}.png`;
        link.click();
      }
    }, 500); // Tempo em milissegundos, ajuste se necessário
  };
  

  return (
    <div id={`order-${finalOrderData.id}`} className="relative min-h-screen w-[760px] px-5 bg-[#ffffff] border-r-[1px] border-[#ccc]">

      <header className='w-full flex-col flex items-center'>
          <h1 className='text-2xl text-[#121214] font-bold uppercase'>Registro de Ordem de Serviço</h1>
        <div className='w-full flex items-center justify-between mt-5'>
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

      <div className='w-full mt-4 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase'>Dados do cliente</h1>
        <div className='w-full flex items-center justify-between px-20'>
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

      <div className='w-full mt-4 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase'>Informações do produto</h1>
        <div className='w-full flex items-center justify-between px-20'>
          <p className='text-base font-extrabold'>Modelo: <span className='text-base font-normal'>{finalOrderData.info_produto}</span></p>
        </div>
      </div>

      <div className='w-full mt-4 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase'>Relato do Cliente</h1>
        <div className='w-full flex items-center justify-between px-20'>
          <p className='text-base font-extrabold'><span className='text-base font-normal'>{finalOrderData.defeito}</span></p>
        </div>
      </div>

      <div className='w-full mt-4 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase'>Diagnóstico e Solução</h1>
        <div className='w-full flex items-center justify-between px-20'>
          <p className='text-base font-extrabold'><span className='text-base font-normal'>{finalOrderData.solucao}</span></p>
        </div>
      </div>

      <div className='w-full mt-4 flex items-center flex-col text-[#121214]'>
        <h1 className='text-base text-[#121214] font-bold uppercase'>Orçamento</h1>
        <div className='w-full flex items-center justify-between px-20'>
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
