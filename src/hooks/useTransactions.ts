import { useCallback, useState } from 'react';
import { transactionService } from '../api/transactionService';
import { Transaction, TransactionFormData } from '../types/transaction';

export const useTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTransactions = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await transactionService.getAllTransactions();
			setTransactions(data);
		} catch (err) {
			setError('Failed to fetch transactions');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createTransaction = useCallback(async (data: TransactionFormData) => {
		try {
			setIsLoading(true);
			setError(null);
			const newTransaction = await transactionService.createTransaction(data);
			setTransactions((prev) => [newTransaction, ...prev]);
			return newTransaction;
		} catch (err) {
			setError('Failed to create transaction');
			console.error(err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateTransaction = useCallback(
		async (id: string, data: Partial<TransactionFormData>) => {
			try {
				setIsLoading(true);
				setError(null);
				const updatedTransaction = await transactionService.updateTransaction(
					id,
					data
				);
				setTransactions((prev) =>
					prev.map((t) => (t.id === id ? updatedTransaction : t))
				);
				return updatedTransaction;
			} catch (err) {
				setError('Failed to update transaction');
				console.error(err);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteTransaction = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			await transactionService.deleteTransaction(id);
			setTransactions((prev) => prev.filter((t) => t.id !== id));
		} catch (err) {
			setError('Failed to delete transaction');
			console.error(err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getTransactionsByDateRange = useCallback(
		async (startDate: Date, endDate: Date) => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await transactionService.getTransactionsByDateRange(
					startDate,
					endDate
				);
				return data;
			} catch (err) {
				setError('Failed to fetch transactions by date range');
				console.error(err);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		transactions,
		isLoading,
		error,
		fetchTransactions,
		createTransaction,
		updateTransaction,
		deleteTransaction,
		getTransactionsByDateRange,
	};
};
