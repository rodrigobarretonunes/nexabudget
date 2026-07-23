import { Wallet, TrendingUp, TrendingDown, PiggyBank, CreditCard } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { useStore } from '../layouts/AppShell';
import { formatEUR, formatDate, currentMonthKey, monthKey } from '../lib/format';

export function Dashboard() {
  const { transactions, deferredDebits, goals, scope } = useStore();

  const visible = transactions.filter((t) => scope === 'shared' ? t.visibility === 'shared' : true);
  const thisMonth = currentMonthKey();
  const monthTx = visible.filter((t) => monthKey(t.date) === thisMonth);

  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const netWorth = visible.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);

  const nextDebit = [...deferredDebits].sort((a, b) => a.debitDate.localeCompare(b.debitDate))[0];
  const debitTotal = deferredDebits
    .filter((d) => nextDebit && d.debitDate === nextDebit.debitDate)
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Patrimônio atual" value={netWorth} icon={Wallet} />
        <StatCard label="Receitas do mês" value={income} icon={TrendingUp} tone="positive" />
        <StatCard label="Despesas do mês" value={expenses} icon={TrendingDown} tone="negative" />
        <StatCard label="Poupança do mês" value={savings} icon={PiggyBank} tone={savings >= 0 ? 'positive' : 'negative'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Metas</h2>
          {goals.length === 0 ? (
            <EmptyState icon={PiggyBank} title="Nenhuma meta criada" hint="Crie uma meta em Metas para acompanhar seu progresso aqui." />
          ) : (
            <div className="flex flex-col gap-4">
              {goals.slice(0, 4).map((g) => (
                <div key={g.id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{g.name}</span>
                    <span className="tabular text-slate-500 dark:text-slate-400">
                      {formatEUR(g.current)} / {formatEUR(g.target)}
                    </span>
                  </div>
                  <ProgressBar value={(g.current / g.target) * 100} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Débit différé previsto</h2>
          {!nextDebit ? (
            <EmptyState icon={CreditCard} title="Nenhum débito futuro" hint="Compras registradas com cartão aparecerão aqui na data de débito." />
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tabular text-slate-900 dark:text-slate-100">{formatEUR(debitTotal)}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">em {formatDate(nextDebit.debitDate)}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
