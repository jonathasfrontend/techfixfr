import { useState, useEffect } from 'react';

export function useCategoria(fk_categoria_id: number) {
  const [categoriaText, setCategoriaText] = useState('');

  useEffect(() => {
    if (fk_categoria_id === 1) {
      setCategoriaText('TVs');
    } else if (fk_categoria_id === 2) {
      setCategoriaText('Notebook');
    } else if (fk_categoria_id === 3) {
      setCategoriaText('PC de Mesa');
    } else if (fk_categoria_id === 4) {
      setCategoriaText('Impressora');
    } else if (fk_categoria_id === 5) {
      setCategoriaText('Celular');
    }
  }, [fk_categoria_id]);

  return { categoriaText };
}
