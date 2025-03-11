import { API_URL, LOCAL_API_URL } from '@env';

// Konfigurasi API dengan dukungan untuk berbagai lingkungan
const getBaseUrl = () => {
	// Untuk pengembangan lokal, gunakan LOCAL_API_URL dari .env
	const LOCAL_URL = LOCAL_API_URL || 'http://192.168.100.13:3000/api';

	// URL untuk produksi, gunakan API_URL dari .env
	const PRODUCTION_URL =
		API_URL || 'https://web-production-248b.up.railway.app/api';

	// Gunakan URL produksi jika aplikasi di-build untuk produksi
	if (__DEV__) {
		console.log('Using LOCAL API URL:', LOCAL_URL);
		return LOCAL_URL;
	}

	console.log('Using PRODUCTION API URL:', PRODUCTION_URL);
	return PRODUCTION_URL;
};

export const API_CONFIG = {
	BASE_URL: getBaseUrl(),
	ENDPOINTS: {
		TRANSACTIONS: '/transactions',
		TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
		TRANSACTIONS_BY_DATE_RANGE: '/transactions/range',
		CATEGORIES: '/categories',
	},
};
