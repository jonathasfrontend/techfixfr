# Techfix FR - Sistema de Cadastro e Gestão de Ordens de Serviço

## 1. Introdução

O sistema Techfix FR é uma plataforma web desenvolvida para facilitar a gestão de ordens de serviço em empresas de reparo de eletrônicos. Ele permite o cadastro de clientes, o acompanhamento de ordens de serviço e a geração de relatórios sobre as atividades realizadas. O projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) e visa atender a uma lacuna no mercado de gerenciamento de reparos, otimizando o fluxo de trabalho e aumentando a eficiência nas operações internas.

## 2. Objetivo

O principal objetivo deste sistema é proporcionar um meio simples e eficiente para gerenciar ordens de serviço, desde o cadastro de clientes até o controle de status dos reparos realizados. O sistema oferece uma interface amigável tanto para os funcionários quanto para os administradores da empresa, facilitando o acompanhamento de todo o ciclo de vida das ordens de serviço.

## 3. Tecnologias Utilizadas

O sistema foi desenvolvido utilizando tecnologias modernas para garantir a escalabilidade, performance e facilidade de manutenção:

- **Front-end**: React.js com Vite.js e Tailwind CSS.
- **Back-end**: Node.js com Express.
- **Banco de Dados**: PostgreSQL.
- **Autenticação**: JWT (JSON Web Tokens) com bcrypt.
- **Hospedagem**: Vercel para o front-end e back-end.

## 4. Funcionalidades Principais

### 4.1. Autenticação de Usuário
O sistema conta com autenticação JWT, onde o usuário se loga utilizando email e senha, gerando um token que é armazenado nos cookies para autenticação contínua em sessões subsequentes. O token expira após 1 hora.

### 4.2. Cadastro de Clientes
O sistema permite o cadastro de novos clientes, incluindo nome, CPF, endereço e telefone. Esses dados são armazenados no banco de dados e associados a futuras ordens de serviço.

### 4.3. Cadastro e Gerenciamento de Ordens de Serviço
Os usuários podem cadastrar novas ordens de serviço associadas a clientes já existentes. Cada ordem de serviço inclui detalhes como o defeito, a solução aplicada, a data de entrega e o status da ordem (em andamento, concluída, etc.).

### 4.4. Painel Administrativo (Dashboard)
O sistema possui uma dashboard que exibe todas as ordens de serviço recentes, organizadas de forma clara, permitindo que os administradores filtrem, pesquisem e editem as ordens conforme necessário.

### 4.5. Controle de Acesso
O sistema foi projetado com controle de acesso, onde diferentes usuários têm diferentes permissões com base em seus cargos (admin, suporte, etc.).

## 5. Estrutura do Projeto

### 5.1. Front-end

#### 5.1.2. Arquivo `App.tsx`

O arquivo principal de roteamento da aplicação utiliza o `react-router-dom` para definir as rotas principais, incluindo a página de login, dashboard e a página de ordens de serviço para clientes específicos.

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from "./contexts/AuthContext";
import User from "./pages/User";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produto/:cpf" element={<User />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```
#### 5.1.3. Arquivo `Dashboard.tsx`

```tsx
import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrder] = useState<Order[]>([]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(()=>{
    async function getOders(){
      const response = await api.get('/ultimas-ordens')
      const reversedOrders = response.data;
      setOrder(reversedOrders);
    }
    getOders();
  }, []);

  return (
    <div>
      {/* Renderização da lista de ordens */}
    </div>
  );
}
```

#### 5.1.1. Arquitetura de Pastas
/src
  /controllers
    AuthController.js
    OrdemController.js
  /models
    Cliente.js
    Ordem.js
  /routes
    index.js
    authRoutes.js
    ordemRoutes.js
  /config
    database.js
  server.js

### 5.2. Back-end

#### 5.2.1. Arquivo `jsonwebtoken`

```js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
```

#### 5.2.1. Rota `/produto/:cpf`
```js
exports.getOrdersByCpf = async (req, res) => {
  const { cpf } = req.params;
  const cliente = await Cliente.findOne({ where: { cpf } });
  if (!cliente) return res.status(404).json({ error: "Client not found" });

  const ordens = await Ordem.findAll({ where: { fk_cliente_cpf: cpf } });
  res.json({ cliente, ordens });
}
```
`npm install`
`npm run dev`
ou
`npm run start`

### Explicação dos itens:
- **Introdução** e **Objetivo** abordam o contexto do sistema e o propósito da aplicação.
- **Tecnologias Utilizadas** descreve as ferramentas escolhidas.
- **Funcionalidades** lista as principais operações que o sistema oferece.
- **Estrutura do Projeto** explica a arquitetura de pastas e os arquivos principais no front-end e back-end.
- **Roteamento e Autenticação** descrevem como funciona o roteamento com React Router e a autenticação com JWT.
- **Configuração e Execução** orienta como configurar o ambiente e rodar o sistema localmente.

Se você precisar de ajustes específicos em qualquer parte da documentação ou mais detalhes técnicos, é só me avisar!


