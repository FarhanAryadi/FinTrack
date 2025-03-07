import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const transactionController = {
	async getAllTransactions(req: Request, res: Response) {
		try {
			const transactions = await prisma.transaction.findMany({
				orderBy: {
					date: 'desc',
				},
				include: {
					Category: true
			});
			res.json(transactions);
		} catch (error) {
			console.error('Error fetching transactions:', error);
			res.status(500).json({ error: 'Failed to fetch transactions' });
		}
	},

	async createTransaction(req: Request, res: Response) {
		try {
			const { amount, type, category, description, date } = req.body;
			const transaction = await prisma.transaction.create({
				data: {
					amount: parseFloat(amount),
					type,
					category,
					description,
					date: new Date(date),
				},
			});
			res.status(201).json(transaction);
		} catch (error) {
			console.error('Error creating transaction:', error);
			res.status(500).json({ error: 'Failed to create transaction' });
		}
	},

	async updateTransaction(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { amount, type, category, description, date } = req.body;
			const transaction = await prisma.transaction.update({
				where: { id },
				data: {
					...(amount && { amount: parseFloat(amount) }),
					...(type && { type }),
					...(category && { category }),
					description,
					...(date && { date: new Date(date) }),
				},
			});
			res.json(transaction);
		} catch (error) {
			console.error('Error updating transaction:', error);
			res.status(500).json({ error: 'Failed to update transaction' });
		}
	},

	async deleteTransaction(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await prisma.transaction.delete({
				where: { id },
			});
			res.status(204).send();
		} catch (error) {
			console.error('Error deleting transaction:', error);
			res.status(500).json({ error: 'Failed to delete transaction' });
		}
	},

	async getTransactionsByDateRange(req: Request, res: Response) {
		try {
			const { start, end } = req.query;
			const transactions = await prisma.transaction.findMany({
				where: {
					date: {
						gte: new Date(start as string),
						lte: new Date(end as string),
					},
				},
				orderBy: {
					date: 'desc',
				},
			});
			res.json(transactions);
		} catch (error) {
			console.error('Error fetching transactions by date range:', error);
			res
				.status(500)
				.json({ error: 'Failed to fetch transactions by date range' });
		}
	},
};
