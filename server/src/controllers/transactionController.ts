import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Definisikan tipe data untuk transaksi
type TransactionCreateData = {
	amount: number;
	type: string;
	category: string;
	description?: string;
	date: Date;
	categoryId?: string;
};

type TransactionUpdateData = {
	amount?: number;
	type?: string;
	category?: string;
	description?: string;
	date?: Date;
	categoryId?: string;
};

// Definisikan tipe data untuk ringkasan transaksi
type TransactionSummary = {
	totalIncome: number;
	totalExpense: number;
	balance: number;
	recentTransactions: any[];
};

export const transactionController = {
	async getAllTransactions(req: Request, res: Response) {
		try {
			// @ts-ignore
			const transactions = await prisma.transaction.findMany({
				orderBy: {
					date: 'desc',
				},
				// @ts-ignore
				include: {
					Category: true,
				},
			});
			res.json(transactions);
		} catch (error) {
			console.error('Error fetching transactions:', error);
			res.status(500).json({ error: 'Failed to fetch transactions' });
		}
	},

	async createTransaction(req: Request, res: Response) {
		try {
			const { amount, type, categoryId, description, date } = req.body;

			// Dapatkan kategori untuk mendapatkan nama kategori
			// @ts-ignore
			const category = await prisma.category.findUnique({
				where: { id: categoryId },
			});

			if (!category) {
				return res.status(400).json({ error: 'Category not found' });
			}

			// @ts-ignore
			const transaction = await prisma.transaction.create({
				data: {
					amount: parseFloat(amount),
					type,
					category: category.name, // Simpan nama kategori
					description,
					date: new Date(date || Date.now()),
					categoryId, // Simpan juga ID kategori untuk relasi
				} as TransactionCreateData,
				// @ts-ignore
				include: {
					Category: true,
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
			const { amount, type, categoryId, description, date } = req.body;

			let categoryName;
			if (categoryId) {
				// @ts-ignore
				const category = await prisma.category.findUnique({
					where: { id: categoryId },
				});

				if (!category) {
					return res.status(400).json({ error: 'Category not found' });
				}

				categoryName = category.name;
			}

			// @ts-ignore
			const transaction = await prisma.transaction.update({
				where: { id },
				data: {
					...(amount && { amount: parseFloat(amount) }),
					...(type && { type }),
					...(categoryName && { category: categoryName }),
					...(categoryId && { categoryId }),
					...(description !== undefined && { description }),
					...(date && { date: new Date(date) }),
				} as TransactionUpdateData,
				// @ts-ignore
				include: {
					Category: true,
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
			// @ts-ignore
			await prisma.transaction.delete({
				where: { id },
			});
			res.json({ message: 'Transaction deleted successfully' });
		} catch (error) {
			console.error('Error deleting transaction:', error);
			res.status(500).json({ error: 'Failed to delete transaction' });
		}
	},

	async getTransactionsByDateRange(req: Request, res: Response) {
		try {
			const { startDate, endDate } = req.query;

			if (!startDate || !endDate) {
				return res
					.status(400)
					.json({ error: 'Start date and end date are required' });
			}

			// @ts-ignore
			const transactions = await prisma.transaction.findMany({
				where: {
					date: {
						gte: new Date(startDate as string),
						lte: new Date(endDate as string),
					},
				},
				orderBy: {
					date: 'desc',
				},
				// @ts-ignore
				include: {
					Category: true,
				},
			});

			res.json(transactions);
		} catch (error) {
			console.error('Error fetching transactions by date range:', error);
			res.status(500).json({ error: 'Failed to fetch transactions' });
		}
	},

	async getTransactionSummary(req: Request, res: Response) {
		try {
			const { startDate, endDate } = req.query;

			if (!startDate || !endDate) {
				return res
					.status(400)
					.json({ error: 'Start date and end date are required' });
			}

			// @ts-ignore
			const transactions = await prisma.transaction.findMany({
				where: {
					date: {
						gte: new Date(startDate as string),
						lte: new Date(endDate as string),
					},
				},
				orderBy: {
					date: 'desc',
				},
				// @ts-ignore
				include: {
					Category: true,
				},
			});

			// Hitung total income dan expense
			let totalIncome = 0;
			let totalExpense = 0;

			transactions.forEach((transaction) => {
				if (transaction.type === 'INCOME') {
					totalIncome += transaction.amount;
				} else if (transaction.type === 'EXPENSE') {
					totalExpense += transaction.amount;
				}
			});

			// Hitung balance
			const balance = totalIncome - totalExpense;

			// Buat objek ringkasan
			const summary: TransactionSummary = {
				totalIncome,
				totalExpense,
				balance,
				recentTransactions: transactions,
			};

			res.json(summary);
		} catch (error) {
			console.error('Error fetching transaction summary:', error);
			res.status(500).json({ error: 'Failed to fetch transaction summary' });
		}
	},
};
