import { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';

export function Settings() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState<string | null>(() => localStorage.getItem('nb-pending-invite'));

  const invite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem('nb-pending-invite', email);
    setPending(email);
    setEmail('');
  };

  const resetData = () => {
    if (!confirm('Isso apagará todos os dados salvos localmente. Continuar?')) return;
    ['nb-transactions', 'nb-debits', 'nb-goals', 'nb-planning', 'nb-pending-invite'].forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <Card className="p-5">
        <h2 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Convidar parceiro</h2>
        <p className="mb-4 text-xs text-slate-400">O convite integra a conta ao mesmo grupo familiar após a conexão com Supabase.</p>
        {pending ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Convite pendente para <span className="font-medium">{pending}</span></p>
        ) : (
          <form onSubmit={invite} className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@parceiro.com"
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
            <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white">
              <UserPlus size={15} /> Convidar
            </button>
          </form>
        )}
      </Card>

      <Card className="p-5 border-rose-200 dark:border-rose-900">
        <h2 className="mb-1 text-sm font-semibold text-rose-600 dark:text-rose-400">Zona de risco</h2>
        <p className="mb-4 text-xs text-slate-400">Remove todos os dados armazenados localmente neste dispositivo.</p>
        <button onClick={resetData} className="flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900 px-3.5 py-2 text-sm font-medium text-rose-600 dark:text-rose-400">
          <Trash2 size={15} /> Apagar todos os dados
        </button>
      </Card>
    </div>
  );
}
