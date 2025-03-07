import { API_URL } from '../config';
import { Category } from '../types/category';

export const categoryService = {
    async getCategories(type: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
        try {
            const response = await fetch(`${API_URL}/categories?type=${type}`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}; 