import { API_URL } from '../config';
import { Category } from '../types/category';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

export const categoryService = {
	async getCategories(type: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
		try {
			console.log(
				'Fetching categories from URL:',
				`${API_URL}/categories?type=${type}`
			);

			const response = await fetchWithTimeout(`${API_URL}/categories?type=${type}`);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Server response error:', response.status, errorText);
				throw new Error(
					`Server responded with status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log('Categories fetched successfully, count:', data.length);
			return data;
		} catch (error) {
			console.error('Error fetching categories:', error);
			return [];
		}
	},
};
