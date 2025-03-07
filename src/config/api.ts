// Konfigurasi API dengan dukungan untuk berbagai lingkungan
const getBaseUrl = () => {
	// Untuk pengembangan lokal
	const LOCAL_IP = '192.168.100.13';
	const LOCAL_URL = `http://${LOCAL_IP}:3000/api`;

	// URL untuk produksi di Railway
	// Catatan: Ganti dengan URL Railway Anda setelah deployment
	// Format: https://finance-tracker-api-production.up.railway.app/api
	const RAILWAY_URL =
		'https://finance-tracker-api-production.up.railway.app/api';

	// Gunakan URL produksi jika aplikasi di-build untuk produksi
	if (__DEV__) {
		return LOCAL_URL;
	}

	// Gunakan Railway URL untuk produksi
	return RAILWAY_URL;
};

export const API_CONFIG = {
	BASE_URL: getBaseUrl(),
	ENDPOINTS: {
		TRANSACTIONS: '/transactions',
		TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
		TRANSACTIONS_BY_DATE_RANGE: '/transactions/range',
	},
};
