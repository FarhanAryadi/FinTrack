import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const categoryController = {
	async getCategories(req: Request, res: Response) {
		try {
			const { type } = req.query;

			const categories = await prisma.category.findMany({
				where: type
					? {
							type: type as string,
					  }
					: undefined,
				orderBy: {
					name: 'asc',
				},
			});

			res.json(categories);
		} catch (error) {
			console.error('Error getting categories:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async createCategory(req: Request, res: Response) {
		try {
			const { name, icon, type } = req.body;

			if (!name || !icon || !type) {
				return res.status(400).json({ error: 'Missing required fields' });
			}

			const newCategory = await prisma.category.create({
				data: {
					name,
					icon,
					type,
				},
			});

			res.status(201).json(newCategory);
		} catch (error) {
			console.error('Error creating category:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async updateCategory(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, icon, type } = req.body;

			if (!name || !icon || !type) {
				return res.status(400).json({ error: 'Missing required fields' });
			}

			const updatedCategory = await prisma.category.update({
				where: {
					id: parseInt(id),
				},
				data: {
					name,
					icon,
					type,
					updatedAt: new Date(),
				},
			});

			res.json(updatedCategory);
		} catch (error) {
			console.error('Error updating category:', error);

			if (error.code === 'P2025') {
				return res.status(404).json({ error: 'Category not found' });
			}

			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async deleteCategory(req: Request, res: Response) {
		try {
			const { id } = req.params;

			await prisma.category.delete({
				where: {
					id: parseInt(id),
				},
			});

			res.json({ message: 'Category deleted successfully' });
		} catch (error) {
			console.error('Error deleting category:', error);

			if (error.code === 'P2025') {
				return res.status(404).json({ error: 'Category not found' });
			}

			res.status(500).json({ error: 'Internal server error' });
		}
	},
};
