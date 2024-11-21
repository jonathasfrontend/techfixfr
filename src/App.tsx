import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import User from "./pages/User";
import { OrderImage } from "./pages/OrderImage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cliente/:id" element={<User />} />
          <Route path="/search" element={<Search />} />
          <Route path="/order-image" element={<OrderImage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
