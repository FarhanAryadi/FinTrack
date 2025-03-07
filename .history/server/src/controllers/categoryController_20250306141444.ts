import { Request, Response } from 'express';
import { pool } from '../db';

export const categoryController = {
	async getCategories(req: Request, res: Response) {
		try {
			const { type } = req.query;
			let query = 'SELECT * FROM categories';
			const values: string[] = [];

			if (type) {
				query += ' WHERE type = $1';
				values.push(type as string);
			}

			query += ' ORDER BY name';

			const result = await pool.query(query, values);
			res.json(result.rows);
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

			const result = await pool.query(
				'INSERT INTO categories (name, icon, type) VALUES ($1, $2, $3) RETURNING *',
				[name, icon, type]
			);

			res.status(201).json(result.rows[0]);
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

			const result = await pool.query(
				'UPDATE categories SET name = $1, icon = $2, type = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
				[name, icon, type, id]
			);

			if (result.rows.length === 0) {
				return res.status(404).json({ error: 'Category not found' });
			}

			res.json(result.rows[0]);
		} catch (error) {
			console.error('Error updating category:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async deleteCategory(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const result = await pool.query(
				'DELETE FROM categories WHERE id = $1 RETURNING *',
				[id]
			);

			if (result.rows.length === 0) {
				return res.status(404).json({ error: 'Category not found' });
			}

			res.json({ message: 'Category deleted successfully' });
		} catch (error) {
			console.error('Error deleting category:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};
