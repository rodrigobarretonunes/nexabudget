import { useEffect, useState } from 'react';
import type { Transaction, DeferredDebit, Goal, PlanningEvent } from '../types';
import { seedTransactions, seedDeferredDebits, seedGoals, seedPlanningEvents } from '../data/seed';

function usePersisted<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
  return [state, setState] as const;
}

export function useBudgetStore() {
  const [transactions, setTransactions] = usePersisted<Transaction[]>('nb-transactions', seedTransactions);
  const [deferredDebits, setDeferredDebits] = usePersisted<DeferredDebit[]>('nb-debits', seedDeferredDebits);
  const [goals, setGoals] = usePersisted<Goal[]>('nb-goals', seedGoals);
  const [planning, setPlanning] = usePersisted<PlanningEvent[]>('nb-planning', seedPlanningEvents);

  const addTransaction = (t: Omit<Transaction, 'id'>) =>
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);

  const removeTransaction = (id: string) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const addDebit = (d: Omit<DeferredDebit, 'id'>) =>
    setDeferredDebits((prev) => [{ ...d, id: crypto.randomUUID() }, ...prev]);

  const removeDebit = (id: string) =>
    setDeferredDebits((prev) => prev.filter((d) => d.id !== id));

  const addGoal = (g: Omit<Goal, 'id'>) =>
    setGoals((prev) => [{ ...g, id: crypto.randomUUID() }, ...prev]);

  const updateGoal = (id: string, current: number) =>
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current } : g)));

  const removeGoal = (id: string) =>
    setGoals((prev) => prev.filter((g) => g.id !== id));

  const addPlanningEvent = (p: Omit<PlanningEvent, 'id'>) =>
    setPlanning((prev) => [...prev, { ...p, id: crypto.randomUUID() }].sort((a, b) => a.date.localeCompare(b.date)));

  const removePlanningEvent = (id: string) =>
    setPlanning((prev) => prev.filter((p) => p.id !== id));

  return {
    transactions, addTransaction, removeTransaction,
    deferredDebits, addDebit, removeDebit,
    goals, addGoal, updateGoal, removeGoal,
    planning, addPlanningEvent, removePlanningEvent,
  };
}
