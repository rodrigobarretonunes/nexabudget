import { useState } from 'react';
import { Plus, Trash2, CalendarClock, Calculator } from 'lucide-react';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../layouts/AppShell';
import { formatEUR, formatDate } from '../lib/format';
import { simulateUnemployment } from '../lib/unemployment';
import type { PlanningEvent, UnemploymentSimResult } from '../types';

const kindLabel: Record<PlanningEvent['kind'], string> = {
  move: 'Mudança', unemployment: 'Chômage', saving: 'Poupança', rent: 'Aluguel', other: 'Outro',
};

function Timeline() {
  const { planning, addPlanningEvent, removePlanningEvent } = useStore();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [kind, setKind] = useState<PlanningEvent['kind']>('other');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !date) return;
    addPlanningEvent({ label, date, kind });
    setLabel(''); setDate(''); setKind('other'); setOpen(false);
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Linha do tempo</h2>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-sm font-medium text-brand">
          <Plus size={15} /> Adicionar evento
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Evento"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
          <select value={kind} onChange={(e) => setKind(e.target.value as PlanningEvent['kind'])}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm">
            {Object.entries(kindLabel).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-3.5 py-2 text-sm font-medium text-white sm:col-span-4">
            Salvar
          </button>
        </form>
      )}

      {planning.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Nenhum evento planejado" hint="Adicione marcos como mudança, fim do contrato ou início do chômage." />
      ) : (
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-2">
          {planning.map((p) => (
            <li key={p.id} className="mb-5 ml-4">
              <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.label}</p>
                  <p className="text-xs text-slate-400">{kindLabel[p.kind]} · {formatDate(p.date)}</p>
                </div>
                <button onClick={() => removePlanningEvent(p.id)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function UnemploymentSimulator() {
  const [grossSalary, setGrossSalary] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<UnemploymentSimResult | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grossSalary || !startDate || !endDate) return;
    setResult(simulateUnemployment({
      grossSalary: Number(grossSalary), bonuses: Number(bonuses || 0), startDate, endDate,
    }));
  };

  return (
    <Card className="p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <Calculator size={16} /> Simulador de chômage (ARE)
      </h2>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} type="number" placeholder="Salário bruto mensal (€)"
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
        <input value={bonuses} onChange={(e) => setBonuses(e.target.value)} type="number" placeholder="Primes anuais (€)"
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Data de início do contrato</label>
          <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Data de saída do contrato</label>
          <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date"
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white sm:col-span-2">
          Calcular estimativa
        </button>
      </form>

      {result && (
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div>
            <p className="text-xs text-slate-400">Estimativa diária</p>
            <p className="tabular text-lg font-semibold text-slate-900 dark:text-slate-100">{formatEUR(result.dailyAllowance)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimativa mensal</p>
            <p className="tabular text-lg font-semibold text-slate-900 dark:text-slate-100">{formatEUR(result.monthlyEstimate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Duração de contrato</p>
            <p className="tabular text-lg font-semibold text-slate-900 dark:text-slate-100">{result.durationDays} dias</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Planning() {
  return (
    <div className="flex flex-col gap-6">
      <Timeline />
      <UnemploymentSimulator />
    </div>
  );
}
