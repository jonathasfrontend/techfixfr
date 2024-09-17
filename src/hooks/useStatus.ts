import { useState, useEffect } from 'react';

export function useStatus(fk_status_id: number) {
  const [statusColor, setStatusColor] = useState('');
  const [statusText, setStatusText] = useState('');
  const [statusBgColor, setStatusBgColor] = useState('');

  useEffect(() => {
    if (fk_status_id === 1) {
      setStatusColor('border-[#808080]');
      setStatusBgColor('text-[#808080]');
      setStatusText('Recebido');
    } else if (fk_status_id === 2) {
      setStatusColor('border-[#ADD8E6]');
      setStatusBgColor('text-[#ADD8E6]');
      setStatusText('Em avaliação');
    } else if (fk_status_id === 3) {
      setStatusColor('border-[#28A745]');
      setStatusBgColor('text-[#28A745]');
      setStatusText('Orçamento aprovado');
    } else if (fk_status_id === 4) {
      setStatusColor('border-[#DC3545]');
      setStatusBgColor('text-[#DC3545]');
      setStatusText('Orçamento Reprovado');
    } else if (fk_status_id === 5) {
      setStatusColor('border-[#007BFF]');
      setStatusBgColor('text-[#007BFF]');
      setStatusText('Em reparo');
    } else if (fk_status_id === 6) {
      setStatusColor('border-[#FD7E14]');
      setStatusBgColor('text-[#FD7E14]');
      setStatusText('Aguardando Peças');
    } else if (fk_status_id === 7) {
      setStatusColor('border-[#006400]');
      setStatusBgColor('text-[#006400]');
      setStatusText('Reparo Concluído');
    } else if (fk_status_id === 8) {
      setStatusColor('border-[#8B0000]');
      setStatusBgColor('text-[#8B0000]');
      setStatusText('Reparo Mal Sucedido');
    } else if (fk_status_id === 9) {
      setStatusColor('border-[#40E0D0]');
      setStatusBgColor('text-[#40E0D0]');
      setStatusText('Pronto para Retirada/Entrega');
    } else if (fk_status_id === 10) {
      setStatusColor('border-[#28A745]');
      setStatusBgColor('text-[#28A745]');
      setStatusText('Entregue');
    } else if (fk_status_id === 11) {
      setStatusColor('border-[#FFC107]');
      setStatusBgColor('text-[#FFC107]');
      setStatusText('Devolução Solicitada');
    } else if (fk_status_id === 12) {
      setStatusColor('border-[#FD7E14]');
      setStatusBgColor('text-[#FD7E14]');
      setStatusText('Produto Devolvido');
    } else if (fk_status_id === 13) {
      setStatusColor('border-[#006400]');
      setStatusBgColor('text-[#006400]');
      setStatusText('Concluido');
    } else if (fk_status_id === 14) {
      setStatusColor('border-[#DC3545]');
      setStatusBgColor('text-[#DC3545]');
      setStatusText('Cancelada');
    }
  }, [fk_status_id]);

  return { statusColor, statusText, statusBgColor };
}
