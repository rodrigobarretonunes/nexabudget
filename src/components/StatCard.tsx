import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { formatEUR } from '../lib/format';

export function StatCard({ label, value, icon: Icon, tone = 'default' }: {
  label: string; value: number; icon: LucideIcon; tone?: 'default' | 'positive' | 'negative';
}) {
  const toneClass = tone === 'positive' ? 'text-emerald-600 dark:text-emerald-400'
    : tone === 'negative' ? 'text-rose-600 dark:text-rose-400'
    : 'text-slate-900 dark:text-slate-100';

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        <Icon size={16} className="text-slate-400" />
      </div>
      <span className={`text-2xl font-semibold tabular ${toneClass}`}>{formatEUR(value)}</span>
    </Card>
  );
}
