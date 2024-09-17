import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

type SignInData = {
  email: string;
  senha: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<SignInData>(); 
  const { signIn } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mensagem de erro

  async function handleSignIn(data: SignInData) {
    try {
      await signIn(data);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col py-12 px-4 bg">

      <h2 className="mt-6 text-center text-4xl font-bold text-white">
        TechFix Login
      </h2>

      <form className="w-[350px] gap-3 " onSubmit={handleSubmit(handleSignIn)}>
        <div>
          <input
            {...register('email')}
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className=" w-full h-[40px] pl-3 rounded-lg mt-3 bg-neutral-700 placeholder-zinc-200 text-white placeholder:text-sm placeholder:font-medium outline-none"
            placeholder="Seu email"
          />
        </div>
        <div>
          <input
            {...register('senha')}
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            className="w-full h-[40px] pl-3 rounded-lg mt-3 bg-neutral-700 placeholder-zinc-200 text-white placeholder:text-sm placeholder:font-medium outline-none"
            placeholder="Sua senha"
            />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <div>
          <button
          type="submit"
          className="w-full h-[40px] text-sm font-medium rounded-lg mt-3 text-white bg-[#2FB600] hover:bg-[#2eb600e2]"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
