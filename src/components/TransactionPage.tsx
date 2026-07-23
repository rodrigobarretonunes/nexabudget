import { useState } from 'react';
import { Plus, Trash2, Lock, Users } from 'lucide-react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { useStore } from '../layouts/AppShell';
import { formatEUR, formatDate } from '../lib/format';
import type { Transaction } from '../types';

export function TransactionPage({ type, emptyHint }: { type: 'income' | 'expense'; emptyHint: string }) {
  const { transactions, addTransaction, removeTransaction, scope } = useStore();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<Transaction['visibility']>('private');

  const list = transactions
    .filter((t) => t.type === type)
    .filter((t) => (scope === 'shared' ? t.visibility === 'shared' : true))
    .sort((a, b) => b.date.localeCompare(a.date));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !amount) return;
    addTransaction({
      label, amount: Number(amount), category: category || 'Geral',
      date: new Date().toISOString().slice(0, 10), visibility, ownerId: 'me', type,
    });
    setLabel(''); setAmount(''); setCategory(''); setVisibility('private'); setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> {type === 'income' ? 'Nova receita' : 'Nova despesa'}
        </button>
      </div>

      {open && (
        <Card className="p-5">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Descrição"
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="Valor (€)"
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria"
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as Transaction['visibility'])}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm">
              <option value="private">Privado</option>
              <option value="shared">Compartilhado</option>
            </select>
            <button type="submit" className="rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-3.5 py-2 text-sm font-medium text-white">
              Salvar
            </button>
          </form>
        </Card>
      )}

      <Card>
        {list.length === 0 ? (
          <EmptyState icon={Plus} title={type === 'income' ? 'Nenhuma receita registrada' : 'Nenhuma despesa registrada'} hint={emptyHint} />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {t.visibility === 'private' ? <Lock size={14} className="text-slate-400" /> : <Users size={14} className="text-slate-400" />}
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.label}</p>
                    <p className="text-xs text-slate-400">{t.category} · {formatDate(t.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`tabular text-sm font-medium ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {type === 'income' ? '+' : '-'}{formatEUR(t.amount)}
                  </span>
                  <button onClick={() => removeTransaction(t.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
