import { useLocation } from 'react-router-dom'; 
import { formatTelefone, formatDate, formatCurrency } from '../services/formatters';
import html2canvas from 'html2canvas';

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
          backgroundColor: '#121214',
          width: 760, // Largura específica
          height: 480, // Altura específica
          scale: 2, // Escala para aumentar a resolução
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
    <div id={`order-${finalOrderData.id}`} className="w-screen h-screen bg-[#121214] p-5 text-2xl text-white">
      <p className=''>Nome: {finalOrderData.nome}</p>
      <h1>Código da Ordem: {finalOrderData.id}</h1>
      <p>CPF: {formatCpf(finalOrderData.cpf)}</p>
      <p>Telefone: {formatTelefone(finalOrderData.telefone)}</p>
      <p>Endereço: {finalOrderData.endereco}</p>
      <h2>Informações do Produto</h2>
      <p>{finalOrderData.info_produto}</p>
      <h2>Relato do Cliente</h2>
      <p>{finalOrderData.defeito}</p>
      <h2>Diagnóstico e Solução</h2>
      <p>{finalOrderData.solucao}</p>
      <h2>Orçamento</h2>
      <p>{formatCurrency(finalOrderData.orcamento)}</p>
      <p>Data da Ordem: {formatDate(finalOrderData.data)}</p>

      <button onClick={captureImage} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
          Gerar Imagem
      </button>
    </div>
  );
}
