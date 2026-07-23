import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Login() {
  return (
    <AuthForm />
  );
}

function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message === 'Email not confirmed'
        ? 'Confirme seu e-mail antes de entrar.'
        : signInError.message);
      return;
    }

    navigate('/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
        <p className="mb-2 text-sm font-semibold text-blue-600">NexaBudget</p>
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Entrar</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Acesse seu controle financeiro.</p>

        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">E-mail</label>
        <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />

        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Senha</label>
        <input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Ainda não tem conta? <Link className="font-semibold text-blue-600 hover:underline" to="/register">Criar cadastro</Link>
        </p>
      </form>
    </main>
  );
}