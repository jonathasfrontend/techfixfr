import { User, WhatsappLogo } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import { formatCpf, formatTelefone, formatDate } from '../services/formatters';
import { useStatus } from '../hooks/useStatus';

interface ClienteData {
  id: string;
  cpf: string;
  nome: string;
  telefone: string;
}
  
interface OrdemData {
  id: string;
  data: string;
  fk_status_id: number;
}
interface CardProps extends ClienteData, OrdemData {}

export function Card(props: CardProps ) {
    const { statusColor, statusText, statusBgColor } = useStatus(props.fk_status_id);

  return (
    <Link to={`/cliente/${props.id}`} className={`w-full h-full relative rounded-md border-solid border-[1px] text-white bg-[#121214a3] ${statusColor} px-5 py-2 overflow-hidden`}>

      <div className='w-full flex items-center justify-between'>
        <h1 className='flex items-center text-base font-medium'>
          <User size={20} className='mr-2' />
          {props.nome}
        </h1>
      </div>
        <h1 className={`absolute top-2 right-5 flex items-center text-sm font-semibold ${statusColor} ${statusBgColor}`}>{statusText}</h1>

      <div className='w-full flex flex-col justify-between mt-3'>
        <h1 className='flex items-center text-xs font-medium text-neutral-500'><span className='mr-2 text-white'>CPF:</span>{formatCpf(props.cpf)}</h1>
        <div className='flex items-center text-xs font-medium text-neutral-500'><WhatsappLogo size={20} className='mr-2 text-white' />{formatTelefone(props.telefone)}</div>
      </div>
        <h1 className='absolute bottom-2 right-5 flex items-center text-[10px] font-bold text-neutral-500'>{formatDate(props.data)}</h1>
    </Link>
  );
}
