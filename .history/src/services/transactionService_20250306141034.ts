import { API_URL } from '../config';

interface CreateTransactionData {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string;
    categoryId: number;
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
}; 