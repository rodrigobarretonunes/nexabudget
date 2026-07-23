import { useState } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { useStore } from '../layouts/AppShell';
import { formatEUR } from '../lib/format';
import type { Goal } from '../types';

export function Goals() {
  const { goals, addGoal, updateGoal, removeGoal, scope } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [visibility, setVisibility] = useState<Goal['visibility']>('private');

  const list = goals.filter((g) => (scope === 'shared' ? g.visibility === 'shared' : true));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    addGoal({ name, target: Number(target), current: 0, visibility, ownerId: 'me' });
    setName(''); setTarget(''); setVisibility('private'); setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          <Plus size={16} /> Nova meta
        </button>
      </div>

      {open && (
        <Card className="p-5">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da meta"
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
            <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" step="0.01" placeholder="Objetivo (€)"
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as Goal['visibility'])}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm">
              <option value="private">Privada</option>
              <option value="shared">Compartilhada</option>
            </select>
            <button type="submit" className="rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-3.5 py-2 text-sm font-medium text-white sm:col-span-4">
              Salvar
            </button>
          </form>
        </Card>
      )}

      {list.length === 0 ? (
        <Card><EmptyState icon={Target} title="Nenhuma meta criada" hint="Crie uma meta para acompanhar seu progresso de poupança." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((g) => (
            <Card key={g.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{g.name}</span>
                <button onClick={() => removeGoal(g.id)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 size={15} />
                </button>
              </div>
              <ProgressBar value={(g.current / g.target) * 100} />
              <div className="flex items-center justify-between text-sm">
                <span className="tabular text-slate-500 dark:text-slate-400">
                  {formatEUR(g.current)} / {formatEUR(g.target)}
                </span>
                <span className="tabular text-xs font-semibold text-brand">
                  {Math.round((g.current / g.target) * 100)}%
                </span>
              </div>
              <input
                type="number" step="0.01" placeholder="Atualizar valor atual (€)" defaultValue={g.current || ''}
                onBlur={(e) => updateGoal(g.id, Number(e.target.value) || 0)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 text-sm"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
