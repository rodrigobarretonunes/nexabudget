import { createContext, useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useBudgetStore } from '../hooks/useBudgetStore';

export type Scope = 'individual' | 'shared';

type StoreCtx = ReturnType<typeof useBudgetStore> & { scope: Scope };
const Ctx = createContext<StoreCtx | null>(null);

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppShell');
  return ctx;
}

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/income': 'Receitas',
  '/expenses': 'Despesas',
  '/goals': 'Metas',
  '/planning': 'Planejamento',
  '/settings': 'Configurações',
};

export function AppShell() {
  const [scope, setScope] = useState<Scope>('individual');
  const store = useBudgetStore();
  const { pathname } = useLocation();

  return (
    <Ctx.Provider value={{ ...store, scope }}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar scope={scope} setScope={setScope} title={titles[pathname] ?? 'NexaBudget'} />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
