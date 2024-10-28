import { useState, useEffect } from 'react';

export function useCategoria(fk_categoria_id: number) {
    const [categoria, setCategoria] = useState<{ id: number; text: string }>({ id: 0, text: '' });

    useEffect(() => {
        switch (fk_categoria_id) {
            case 1:
                setCategoria({ id: 1, text: 'TVs' });
                break;
            case 2:
                setCategoria({ id: 2, text: 'Notebook' });
                break;
            case 3:
                setCategoria({ id: 3, text: 'PC de Mesa' });
                break;
            case 4:
                setCategoria({ id: 4, text: 'Impressora' });
                break;
            case 5:
                setCategoria({ id: 5, text: 'Celular' });
                break;
            default:
                setCategoria({ id: 0, text: '' });
        }
    }, [fk_categoria_id]);

    return categoria;
}
