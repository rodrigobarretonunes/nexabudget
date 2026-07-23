import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Icon size={28} className="text-slate-300 dark:text-slate-700" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">{hint}</p>
    </div>
  );
}
