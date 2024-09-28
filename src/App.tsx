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
          <Route path="/cliente/:cpf" element={<User />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
