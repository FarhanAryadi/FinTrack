import { Category } from './category';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  categoryId?: string;
  Category?: Category;
}

export interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category: string;
  description?: string;
  date: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
} 