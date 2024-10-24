import { useStatus } from '../hooks/useStatus';
import { useCategoria } from '../hooks/useCategoria';
import { formatCpf, formatTelefone, formatDate } from '../services/formatters';
import * as Accordion from '@radix-ui/react-accordion';
import { CalendarBlank, CaretDown, Check, Tag, WhatsappLogo } from '@phosphor-icons/react';

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

interface CardProps extends ClienteData, OrdemData {}

export function CardUserAccordion(props: CardProps) {
  const { statusColor, statusText, statusBgColor } = useStatus(props.fk_status_id);
  const { categoriaText } = useCategoria(props.fk_categoria_id);
  const isClosed = statusText === 'Concluído' || statusText === 'Cancelado';
  
  return (
    <Accordion.Root
      className="w-full mb-5"
      type="single"
      defaultValue={isClosed ? undefined : 'item-1'}
      collapsible
    >
      <Accordion.Item className={`w-full bg-[#00000062] p-5 rounded-md border-[2px] ${statusColor} border-solid`} value="item-1">

        <Accordion.Header>
          <Accordion.Trigger className='AccordionTrigger text-xl text-white w-full flex items-center justify-between'>
            <h1 className='font-semibold text-base'>Codigo da ordem <span className='ml-2 text-neutral-500'>{props.id}</span> </h1>
            <div className='flex items-center'>
              <h1 className={`text-base font-semibold ${statusColor} ${statusBgColor}`}>{statusText}</h1>
              <CaretDown size={24} className="ml-2 transition-transform duration-200 accordion-icon" />
            </div>
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className='mt-5'>
          <p className='text-xs font-medium my-2 text-white'>CPF: <span className='ml-2 text-neutral-500'>{formatCpf(props.cpf)}</span></p>

          <div className='p-1 rounded-md bg-gradient-to-t from-[#128c7e] to-[#25d366] w-[160px]'>
            <a href={`https://api.whatsapp.com/send?phone=${props.telefone}`} 
              className='w-8 h-8'
            >
              <div className='w-full h-full flex items-center justify-center'>
                <WhatsappLogo className='text-white h-6 w-6 mr-2' />
                <p className='flex items-center text-sm font-medium text-white'>{formatTelefone(props.telefone)}</p>
              </div>
            </a>
          </div>

          <p className='text-xs font-medium mt-2 text-white'>Endereço: <span className='mr-2 text-neutral-500'>{props.endereco}</span></p>

          <div className='w-full bg-[#00000052] rounded-md my-3 p-3'>
            <h1 className='font-medium text-sm text-white ml-5'>Informações do Produto:</h1>
            <p className='font-normal text-xs ml-5 mt-2 text-neutral-400'>{props.info_produto}</p>
          </div>
          <div className='w-full bg-[#00000052] rounded-md my-3 p-3'>
            <h1 className='font-medium text-sm text-white ml-5'>Relato do Cliente:</h1>
            <p className='font-normal text-xs ml-5 mt-2 text-neutral-400'>{props.defeito}</p>
          </div>
          <div className='w-full bg-[#00000052] rounded-md my-3 p-3'>
            <h1 className='font-medium text-sm text-white ml-5'>Diagnóstico e serviço a ser prestado:</h1>
            <p className='font-normal text-xs ml-5 mt-2 text-neutral-400'>{props.solucao}</p>
          </div>

          <button className='bg-[#2FB600] flex items-center px-5 py-2 mt-6 rounded-full text-white text-sm font-semibold '>
            Na Garantia <Check className='w-5 h-5 ml-2'/>
          </button>

          <div className='w-full mt-5 flex items-center justify-between'>
            <div className='flex items-center'>
              <h1 className='text-white text-sm font-semibold'>Orçamento: <span className='font-bold'>R${props.orcamento}</span></h1>
              <p className='flex items-center text-xs text-white font-medium ml-5'>
                <Tag className='w-4 h-4 mr-1'/>{categoriaText}
              </p>
              <p className='flex items-center text-xs text-white font-medium ml-5'>
                <CalendarBlank className='w-4 h-4 mr-1' />{formatDate(props.data)}
              </p>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

    </Accordion.Root>
  )
}