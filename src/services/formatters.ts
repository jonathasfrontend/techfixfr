export const formatCpf = (cpf: string) => {   
  // Primeiro, formata o CPF corretamente
  const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  
  // Substitui os primeiros 6 números por asteriscos
  return formattedCpf.replace(/(\d{3})\.(\d{3})/, "***.***");
};

export const formatTelefone = (telefone: string) => {
  if (telefone.length === 11) {
    // Formato (00) 00000-0000
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length === 10) {
    // Formato (00) 0000-0000
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
}
  
export const formatDate = (data: string) => {
  const [year, month, day] = data.split("-");
  return `${day}/${month}/${year.slice(0)}`;
}
  