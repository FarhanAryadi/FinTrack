import { API_URL } from '../config';
import { Transaction, TransactionSummary } from '../types/transaction';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

interface CreateTransactionData {
	type: 'INCOME' | 'EXPENSE';
	amount: number;
	description: string;
	categoryId: string;
	date?: Date;
}

export const transactionService = {
	async createTransaction(data: CreateTransactionData) {
		try {
			console.log('Creating transaction with URL:', `${API_URL}/transactions`);
			console.log('Transaction data:', JSON.stringify(data));

			const response = await fetchWithTimeout(`${API_URL}/transactions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					date: data.date ? data.date.toISOString() : new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error('Error in createTransaction:', error);
			throw error;
		}
	},

	async getTransactions() {
		try {
			console.log('Fetching transactions from URL:', `${API_URL}/transactions`);

			const response = await fetchWithTimeout(`${API_URL}/transactions`);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log('Transactions fetched successfully, count:', data.length);
			return data;
		} catch (error) {
			console.error('Error in getTransactions:', error);
			throw error;
		}
	},

	async getTransactionsByDateRange(startDate: Date, endDate: Date) {
		try {
			const start = startDate.toISOString();
			const end = endDate.toISOString();

			console.log(
				'Fetching transactions by date range from URL:',
				`${API_URL}/transactions/date-range?startDate=${start}&endDate=${end}`
			);

			const response = await fetchWithTimeout(
				`${API_URL}/transactions/date-range?startDate=${start}&endDate=${end}`
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log(
				'Transactions by date range fetched successfully, count:',
				data.length
			);
			return data;
		} catch (error) {
			console.error('Error in getTransactionsByDateRange:', error);
			throw error;
		}
	},

	async getTransactionSummary(
		startDate: Date,
		endDate: Date
	): Promise<TransactionSummary> {
		try {
			const start = startDate.toISOString();
			const end = endDate.toISOString();

			console.log(
				'Fetching transaction summary from URL:',
				`${API_URL}/transactions/summary?startDate=${start}&endDate=${end}`
			);

			const response = await fetchWithTimeout(
				`${API_URL}/transactions/summary?startDate=${start}&endDate=${end}`
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log('Transaction summary fetched successfully');
			return data;
		} catch (error) {
			console.error('Error in getTransactionSummary:', error);
			throw error;
		}
	},

	async deleteTransaction(id: string) {
		try {
			console.log(
				'Deleting transaction with URL:',
				`${API_URL}/transactions/${id}`
			);

			const response = await fetchWithTimeout(`${API_URL}/transactions/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			return true;
		} catch (error) {
			console.error('Error in deleteTransaction:', error);
			throw error;
		}
	},
};
