export const formatEUR = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

export const monthKey = (iso: string) => iso.slice(0, 7);

export const currentMonthKey = () => new Date().toISOString().slice(0, 7);
