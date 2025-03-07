import { Transaction, TransactionFormData } from '../types/transaction';
import { API_CONFIG } from '../config/api';

export const transactionService = {
	async getAllTransactions(): Promise<Transaction[]> {
		try {
			const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`);
			if (!response.ok) {
				throw new Error('Failed to fetch transactions');
			}
			const data = await response.json();
			return data.map((transaction: any) => ({
				...transaction,
				date: new Date(transaction.date),
				createdAt: new Date(transaction.createdAt),
				updatedAt: new Date(transaction.updatedAt),
			}));
		} catch (error) {
			console.error('Error fetching transactions:', error);
			throw error;
		}
	},

	async createTransaction(data: TransactionFormData): Promise<Transaction> {
		try {
			const response = await fetch(
				`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						...data,
						amount: parseFloat(data.amount),
					}),
				}
			);
			if (!response.ok) {
				throw new Error('Failed to create transaction');
			}
			const transaction = await response.json();
			return {
				...transaction,
				date: new Date(transaction.date),
				createdAt: new Date(transaction.createdAt),
				updatedAt: new Date(transaction.updatedAt),
			};
		} catch (error) {
			console.error('Error creating transaction:', error);
			throw error;
		}
	},

	async updateTransaction(
		id: string,
		data: Partial<TransactionFormData>
	): Promise<Transaction> {
		try {
			const response = await fetch(
				`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTION_BY_ID(id)}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						...data,
						amount: data.amount ? parseFloat(data.amount) : undefined,
					}),
				}
			);
			if (!response.ok) {
				throw new Error('Failed to update transaction');
			}
			const transaction = await response.json();
			return {
				...transaction,
				date: new Date(transaction.date),
				createdAt: new Date(transaction.createdAt),
				updatedAt: new Date(transaction.updatedAt),
			};
		} catch (error) {
			console.error('Error updating transaction:', error);
			throw error;
		}
	},

	async deleteTransaction(id: string): Promise<void> {
		try {
			const response = await fetch(
				`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTION_BY_ID(id)}`,
				{
					method: 'DELETE',
				}
			);
			if (!response.ok) {
				throw new Error('Failed to delete transaction');
			}
		} catch (error) {
			console.error('Error deleting transaction:', error);
			throw error;
		}
	},

	async getTransactionsByDateRange(
		startDate: Date,
		endDate: Date
	): Promise<Transaction[]> {
		try {
			const response = await fetch(
				`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS_BY_DATE_RANGE}?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch transactions by date range');
			}
			const data = await response.json();
			return data.map((transaction: any) => ({
				...transaction,
				date: new Date(transaction.date),
				createdAt: new Date(transaction.createdAt),
				updatedAt: new Date(transaction.updatedAt),
			}));
		} catch (error) {
			console.error('Error fetching transactions by date range:', error);
			throw error;
		}
	},
};
