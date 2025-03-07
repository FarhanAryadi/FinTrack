import { API_URL } from '../config';

interface CreateTransactionData {
	type: 'INCOME' | 'EXPENSE';
	amount: number;
	description: string;
	categoryId: string;
}

export const transactionService = {
	async createTransaction(data: CreateTransactionData) {
		const response = await fetch(`${API_URL}/transactions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...data,
				date: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to create transaction');
		}

		return await response.json();
	},

	async getTransactions() {
		const response = await fetch(`${API_URL}/transactions`);

		if (!response.ok) {
			throw new Error('Failed to fetch transactions');
		}

		return await response.json();
	},

	async getTransactionsByDateRange(startDate: Date, endDate: Date) {
		const start = startDate.toISOString();
		const end = endDate.toISOString();

		const response = await fetch(
			`${API_URL}/transactions/date-range?startDate=${start}&endDate=${end}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch transactions by date range');
		}

		return await response.json();
	},
};
