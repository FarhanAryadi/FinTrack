import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Definisikan tipe data untuk kategori
type CategoryCreateData = {
	name: string;
	type: string;
	icon: string;
};

type CategoryUpdateData = {
	name?: string;
	type?: string;
	icon?: string;
};

export const categoryController = {
	async getCategories(req: Request, res: Response) {
		try {
			const { type } = req.query;

			// @ts-ignore
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

			// @ts-ignore
			const newCategory = await prisma.category.create({
				data: {
					name,
					icon,
					type,
				} as CategoryCreateData,
			});

			res.status(201).json(newCategory);
		} catch (error: any) {
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

			// @ts-ignore
			const updatedCategory = await prisma.category.update({
				where: {
					id,
				},
				data: {
					name,
					icon,
					type,
				} as CategoryUpdateData,
			});

			res.json(updatedCategory);
		} catch (error: any) {
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

			// @ts-ignore
			await prisma.category.delete({
				where: {
					id,
				},
			});

			res.json({ message: 'Category deleted successfully' });
		} catch (error: any) {
			console.error('Error deleting category:', error);

			if (error.code === 'P2025') {
				return res.status(404).json({ error: 'Category not found' });
			}

			res.status(500).json({ error: 'Internal server error' });
		}
	},
};
