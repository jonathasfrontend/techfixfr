import { createContext, useState, useEffect, ReactNode } from "react";
import { setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type User = {
  nome: string;
  email: string;
};

type SignInData = {
  email: string;
  senha: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Adicionar setUser aqui
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api.get("/admins").then((response) => {
        const { user } = response.data;
        setUser(user);
      })
    }
  }, [navigate]);

  async function signIn({ email, senha }: SignInData) {
    try {
      const response = await api.post("/authenticate", {
        email,
        senha,
      });
  
      const { token, user } = response.data;
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });
  
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
  
      setUser(user);
      navigate("/dashboard");
    } catch (err: any) {

      if (err.response && err.response.status === 401) {
        throw new Error("E-mail ou senha incorretos.");
      } else {
        throw new Error("Erro ao fazer login. Tente novamente.");
      }
    }
  }
  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
