import { useState, useEffect } from 'react';

export function useStatus(fk_status_id: number) {
    const [status, setStatus] = useState<{ id: number; text: string; }>({ id: 0, text: ''});

    useEffect(() => {
        switch (fk_status_id) {
            case 1:
                setStatus({ id: 1, text: 'Recebido'});
                break;
            case 2:
                setStatus({ id: 2, text: 'Em avaliação'});
                break;
            case 3:
                setStatus({ id: 3, text: 'Orçamento aprovado'});
                break;
            case 4:
                setStatus({ id: 4, text: 'Orçamento Reprovado'});
                break;
            case 5:
                setStatus({ id: 5, text: 'Em reparo'});
                break;
            case 6:
                setStatus({ id: 6, text: 'Aguardando Peças'});
                break;
            case 7:
                setStatus({ id: 7, text: 'Reparo Concluído'});
                break;
            case 8:
                setStatus({ id: 8, text: 'Reparo Mal Sucedido'});
                break;
            case 9:
                setStatus({ id: 9, text: 'Pronto para Retirada/Entrega'});
                break;
            case 10:
                setStatus({ id: 10, text: 'Entregue'});
                break;
            case 11:
                setStatus({ id: 11, text: 'Devolução Solicitada'});
                break;
            case 12:
                setStatus({ id: 12, text: 'Produto Devolvido'});
                break;
            case 13:
                setStatus({ id: 13, text: 'Concluido'});
                break;
            case 14:
                setStatus({ id: 14, text: 'Cancelada'});
                break;
            default:
                setStatus({ id: 0, text: ''});
        }
    }, [fk_status_id]);

    return status;
}
