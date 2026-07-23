import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.user && data.user.identities?.length === 0) {
      setError('Este e-mail já está cadastrado. Tente entrar.');
      return;
    }

    if (data.session) {
      navigate('/');
      return;
    }

    setMessage('Cadastro criado. Verifique seu e-mail para confirmar a conta.');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
        <p className="mb-2 text-sm font-semibold text-blue-600">NexaBudget</p>
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Criar conta</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Comece a organizar suas finanças.</p>

        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">E-mail</label>
        <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />

        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Senha</label>
        <input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {message && <p className="mb-4 text-sm text-emerald-600">{message}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Já tem uma conta? <Link className="font-semibold text-blue-600 hover:underline" to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}