import { LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import type { Scope } from './AppShell';

export function Topbar({ scope, setScope, title }: { scope: Scope; setScope: (s: Scope) => void; title: string }) {
  const { dark, toggle } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-sm">
          {(['individual', 'shared'] as Scope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                scope === s ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {s === 'individual' ? 'Individual' : 'Casal'}
            </button>
          ))}
        </div>
        <button
          onClick={toggle}
          className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Alternar tema"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Sair"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
