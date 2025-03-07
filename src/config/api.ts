// Konfigurasi API dengan dukungan untuk berbagai lingkungan
const getBaseUrl = () => {
	// Untuk pengembangan lokal
	const LOCAL_IP = '192.168.100.13';
	const LOCAL_URL = `http://${LOCAL_IP}:3000/api`;

	// URL untuk produksi (ganti dengan URL server Anda setelah di-deploy)
	// Contoh: https://finance-tracker-api.onrender.com/api
	// atau: https://finance-tracker-api.herokuapp.com/api
	const PRODUCTION_URL = 'https://finance-tracker-api.onrender.com/api';

	// Gunakan URL produksi jika aplikasi di-build untuk produksi
	if (__DEV__) {
		return LOCAL_URL;
	}

	return PRODUCTION_URL;
};

export const API_CONFIG = {
	BASE_URL: getBaseUrl(),
	ENDPOINTS: {
		TRANSACTIONS: '/transactions',
		TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
		TRANSACTIONS_BY_DATE_RANGE: '/transactions/range',
	},
};
