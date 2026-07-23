import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Target, CalendarClock, Settings, Wallet } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/income', label: 'Receitas', icon: ArrowUpCircle },
  { to: '/expenses', label: 'Despesas', icon: ArrowDownCircle },
  { to: '/goals', label: 'Metas', icon: Target },
  { to: '/planning', label: 'Planejamento', icon: CalendarClock },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-4">
      <div className="flex items-center gap-2 px-2 pb-6">
        <Wallet size={20} className="text-brand" />
        <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">NexaBudget</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
