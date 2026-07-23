import type { UnemploymentSimInput, UnemploymentSimResult } from '../types';

// Aproximação simplificada da ARE (France Travail). Não substitui simulação oficial.
export function simulateUnemployment({ grossSalary, bonuses, startDate, endDate }: UnemploymentSimInput): UnemploymentSimResult {
  const dailyRef = (grossSalary + bonuses / 12) / 30;
  const dailyAllowance = Math.max(dailyRef * 0.57, dailyRef * 0.404 + 12.95);
  const durationDays = Math.max(0, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000));
  return { dailyAllowance, monthlyEstimate: dailyAllowance * 30, durationDays };
}
