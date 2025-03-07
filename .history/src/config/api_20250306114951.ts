// Ganti 192.168.1.X dengan IP address komputer Anda
export const API_CONFIG = {
	BASE_URL: 'http://192.168.1.X:3000/api',
	ENDPOINTS: {
		TRANSACTIONS: '/transactions',
		TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
		TRANSACTIONS_BY_DATE_RANGE: '/transactions/range',
	},
};
