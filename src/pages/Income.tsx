import { TransactionPage } from '../components/TransactionPage';

export function Income() {
  return <TransactionPage type="income" emptyHint="Adicione seu salário ou outras entradas para começar a acompanhar." />;
}
