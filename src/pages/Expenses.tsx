import { useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { TransactionPage } from '../components/TransactionPage';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../layouts/AppShell';
import { formatEUR, formatDate } from '../lib/format';

function DeferredDebits() {
  const { deferredDebits, addDebit, removeDebit } = useStore();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [card, setCard] = useState('');
  const [debitDate, setDebitDate] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !amount || !debitDate) return;
    addDebit({ label, amount: Number(amount), card: card || 'Cartão', debitDate, purchaseDate: new Date().toISOString().slice(0, 10) });
    setLabel(''); setAmount(''); setCard(''); setDebitDate(''); setOpen(false);
  };

  const sorted = [...deferredDebits].sort((a, b) => a.debitDate.localeCompare(b.debitDate));

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Débit différé</h2>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-sm font-medium text-brand">
          <Plus size={15} /> Adicionar
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Descrição da compra"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="Valor (€)"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
          <input value={card} onChange={(e) => setCard(e.target.value)} placeholder="Cartão"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
          <input value={debitDate} onChange={(e) => setDebitDate(e.target.value)} type="date"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm sm:col-span-3" />
          <button type="submit" className="rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-3.5 py-2 text-sm font-medium text-white">
            Salvar
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon={CreditCard} title="Nenhum débito futuro" hint="Registre compras parceladas ou de débito diferido para ver a previsão de cobrança." />
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{d.label}</p>
                <p className="text-xs text-slate-400">{d.card} · débito em {formatDate(d.debitDate)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="tabular text-sm font-medium text-slate-700 dark:text-slate-300">{formatEUR(d.amount)}</span>
                <button onClick={() => removeDebit(d.id)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function Expenses() {
  return (
    <div className="flex flex-col gap-6">
      <TransactionPage type="expense" emptyHint="Adicione o aluguel, contas ou compras para começar a acompanhar." />
      <DeferredDebits />
    </div>
  );
}
