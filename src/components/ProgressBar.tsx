export function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-1.5 rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
