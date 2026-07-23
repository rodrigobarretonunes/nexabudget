export type Visibility = 'private' | 'shared';
export type Member = { id: string; name: string; initials: string };

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  date: string;
  category: string;
  visibility: Visibility;
  ownerId: string;
  type: 'income' | 'expense';
};

export type DeferredDebit = {
  id: string;
  label: string;
  amount: number;
  purchaseDate: string;
  debitDate: string;
  card: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
  visibility: Visibility;
  ownerId: string;
};

export type PlanningEvent = {
  id: string;
  date: string;
  label: string;
  kind: 'move' | 'unemployment' | 'saving' | 'rent' | 'other';
};

export type UnemploymentSimInput = {
  grossSalary: number;
  bonuses: number;
  startDate: string;
  endDate: string;
};

export type UnemploymentSimResult = {
  dailyAllowance: number;
  monthlyEstimate: number;
  durationDays: number;
};
