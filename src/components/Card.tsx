import { User, WhatsappLogo } from "@phosphor-icons/react";
import { formatCpf, formatTelefone, formatDate } from '../services/formatters';
import { useStatus } from '../hooks/useStatus';

interface ClienteData {
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
    <div className={`w-full h-full relative rounded-md border-solid border-[1px] text-white bg-[#121214a3] ${statusColor} px-5 py-2 overflow-hidden`}>

      <div className='w-full flex items-center justify-between'>
        <a href={`/produto/${props.cpf}`}>
            <h1 className='flex items-center text-xl font-medium'><User size={20} className='mr-2' />{props.nome}</h1>
        </a>
      </div>
        <h1 className={`absolute top-2 right-5 flex items-center text-base font-semibold ${statusColor} ${statusBgColor}`}>{statusText}</h1>

      <div className='w-full flex flex-col justify-between mt-3'>
        <h1 className='flex items-center text-sm font-medium text-neutral-500'><span className='mr-2 text-white'>CPF:</span>{formatCpf(props.cpf)}</h1>
        <a href={`https://api.whatsapp.com/send?phone=${props.telefone}`} className='flex items-center text-sm font-medium text-neutral-500'><WhatsappLogo size={20} className='mr-2 text-white' />{formatTelefone(props.telefone)}</a>
      </div>
        <h1 className='absolute bottom-2 right-5 flex items-center text-xs font-bold text-neutral-500'>{formatDate(props.data)}</h1>
    </div>
  );
}
