// Ganti dengan URL API yang sesuai dengan konfigurasi server Anda
export const API_CONFIG = {
	BASE_URL: 'http://localhost:3000/api',
	ENDPOINTS: {
		TRANSACTIONS: '/transactions',
		TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
		TRANSACTIONS_BY_DATE_RANGE: '/transactions/range',
	},
};
