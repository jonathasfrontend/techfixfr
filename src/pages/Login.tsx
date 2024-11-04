import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react';
import logo from '../assets/logo.jpg';

type SignInData = {
  email: string;
  senha: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<SignInData>(); 
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  function notifyError() {
    toast.error('Erro ao fazer login, tente novamente!');
  }

  async function handleSignIn(data: SignInData) {
    setIsLoading(true);
    try {
      await signIn(data);
    } catch (err: any) {
      notifyError();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center flex-col py-12 px-4 bg">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-16 py-3">
        <div className='w-1/2 flex items-center'>
          <img src={logo} className='w-10 h-10 rounded-full border-[2px] mr-3 border-solid border-green-600' alt="" />
          <h1 className='text-2xl text-white font-bold'>Tech Fix FR</h1>
        </div>
      </header>

      <form className="w-[350px] gap-3" onSubmit={handleSubmit(handleSignIn)}>
        <h2 className="font-bold text-green-200 text-2xl">
          Acesse sua conta
        </h2>
        <div>
          <input
            {...register('email')}
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full h-[40px] text-sm pl-3 rounded-md mt-3 bg-[#031003fd] placeholder-gray-400 text-white placeholder:text-sm placeholder:font-medium outline-none"
            placeholder="Seu email"
          />
        </div>
        <div className="w-full h-[40px] mt-3 bg-[#031003fd] rounded-md overflow-hidden flex items-center justify-between">
          <input
            {...register('senha')}
            id="senha"
            name="senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="w-full px-3 bg-[#031003fd] text-sm placeholder-gray-400 text-white placeholder:text-sm placeholder:font-medium outline-none"
            placeholder="Sua senha"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className=" text-gray-400 hover:text-gray-200 w-9 h-full "
          >
            {showPassword ? <EyeSlash  className='w-full h-full pr-3'/> : <Eye  className='w-full h-full pr-3'/>}
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full h-[40px] outline-none text-sm font-medium rounded-md mt-3 text-white bg-[#2FB600] hover:bg-[#2eb600e2] flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircleNotch className="animate-spin text-white" size={32} />
            ) : (
              'Entrar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
