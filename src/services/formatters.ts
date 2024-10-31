export const formatCpf = (cpf: string) => {   
  const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return formattedCpf.replace(/(\d{3})\.(\d{3})/, "***.***");
};

export const formatTelefone = (telefone: string) => {
  if (telefone.length === 11) {
    return telefone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
}
  
export const formatDate = (data: string) => {
  const [year, month, day] = data.split("-");
  return `${day}/${month}/${year.slice(0)}`;
}

export const formatCurrency = (value: string) => {
  const cleanedValue = value.replace(/\D/g, "");
  const formattedValue = (Number(cleanedValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
  });
  return formattedValue;
};