import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';
import LoginForm from '../../components/loginForm/LoginForm';

function LoginPage() {
  const { login, register, recover } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('login');

  const handleChangeEmail = (value) => setEmail(value);
  const handleChangePass = (value) => setPassword(value);
  const handleChangeName = (value) => setName(value);

  const validateForm = () => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regexEmail.test(email)) {
      toast.error(`Email invalido`);
      return false;
    }
    if (!regexPass.test(password) && type === 'signup') {
      toast.warn("Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo.");
      return false;
    }
    return true;
  };

  const handleSubmitLogin = async () => {
    setIsLoading(true);
    try {
      await login({ email, password });
      setEmail("");
      setPassword("");
      setName("");
      navigate('/', { replace: true });
    } catch (err) {
      toast.error('Email ou senha invalida, tente novamente.');
      setPassword("");
      console.error("Falha no login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCreate = async () => {
    setIsLoading(true);
    try {
      await register({ email, password, name });
      toast.success('Usuário criado com sucesso.');
      setPassword("");
      setName("");
      setType('login');
    } catch (err) {
      toast.error('Usuário não foi criado.');
      console.error("Falha no login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (type === 'signup' && !name) {
      toast.warn("Por favor, preencha o nome.");
      return;
    }
    if (!email) {
      toast.warn("Por favor, preencha o e-mail.");
      return;
    }
    if (!password) {
      toast.warn("Por favor, preencha a senha.");
      return;
    }
    if (!validateForm()) return;

    if (type === 'login') {
      handleSubmitLogin();
    } else {
      handleSubmitCreate();
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-[420px] bg-white border border-zinc-200 rounded-xl shadow-sm p-10">

        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="AvaliacoesLogo.png"
            alt="Avaliações.cloud"
            className="h-14 w-auto mb-4"
          />

          {isLoading ? (
            <Loading />
          ) : (
            <p className="text-sm text-zinc-500">
              {type === 'login'
                ? 'Entre com seus dados de acesso'
                : 'Preencha os dados pra criar sua conta'}
            </p>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          {type === "signup" && (
            <LoginForm
              label="Nome:"
              value={name || ""}
              onChange={handleChangeName}
              placeholder="Digite o nome"
            />
          )}

          <LoginForm
            label="Email:"
            value={email || ""}
            onChange={handleChangeEmail}
            placeholder="Digite o email"
          />
          <LoginForm
            label="Senha:"
            value={password || ""}
            onChange={handleChangePass}
            placeholder="Digite a senha"
            type="password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 h-[46px] w-full rounded-lg text-white bg-zinc-700 hover:bg-zinc-900 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {type === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-100 flex justify-between items-center text-sm">
          {type === "login" ? (
            <>
              <p className="text-zinc-500">Não tem uma conta?</p>
              <span
                onClick={() => {
                  setType("signup");
                  setEmail("");
                  setName("");
                  setPassword("");
                }}
                className="cursor-pointer font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
              >
                Criar conta
              </span>
            </>
          ) : (
            <>
              <p className="text-zinc-500">Já tem uma conta?</p>
              <span
                onClick={() => {
                  setType("login");
                  setEmail("");
                  setName("");
                  setPassword("");
                }}
                className="cursor-pointer font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
              >
                Entrar
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;