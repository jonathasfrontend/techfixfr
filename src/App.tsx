import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import { AuthProvider } from "./contexts/AuthContext";
import User from "./pages/User";
import { OrderImage } from "./components/OrderImage";

// Exemplo de dados de orderData
const orderData = {
  id: "123",
  data: "2024-10-31",
  info_produto: "Produto Exemplo",
  defeito: "Defeito Exemplo",
  solucao: "Solução Exemplo",
  garantia: "12 meses",
  fk_cliente_cpf: "123.456.789-00",
  fk_status_id: 1,
  fk_categoria_id: 2,
  orcamento: "R$ 100,00",
  cpf: "123.456.789-00",
  nome: "Cliente Exemplo",
  endereco: "Endereço Exemplo",
  telefone: "(11) 98765-4321",
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cliente/:id" element={<User />} />
          <Route path="/search" element={<Search />} />
          <Route path="/order-image" element={<OrderImage orderData={orderData} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
