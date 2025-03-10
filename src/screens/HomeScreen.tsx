import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import BottomNavigation from '../components/navigation/BottomNavigation';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
	const navigation = useNavigation();
	const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('INCOME');
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [balance, setBalance] = useState(0);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [activePeriod, setActivePeriod] = useState<
		'daily' | 'monthly' | 'yearly'
	>('monthly');

	const fetchTransactions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await transactionService.getTransactions();
			setTransactions(data);

			// Calculate totals
			let totalIncome = 0;
			let totalExpense = 0;

			data.forEach((transaction: Transaction) => {
				if (transaction.type === 'INCOME') {
					totalIncome += transaction.amount;
				} else {
					totalExpense += transaction.amount;
				}
			});

			setIncome(totalIncome);
			setExpense(totalExpense);
			setBalance(totalIncome - totalExpense);
		} catch (error) {
			console.error('Error fetching transactions:', error);
			setError('Gagal memuat data transaksi. Silakan coba lagi.');

			Alert.alert(
				'Error',
				'Gagal memuat data transaksi. Pastikan server backend berjalan dan dapat diakses.',
				[
					{
						text: 'Coba Lagi',
						onPress: () => fetchTransactions(),
					},
				]
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchTransactions();
	}, [fetchTransactions]);

	// Calculate summary data
	const calculateSummary = () => {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - today.getDay());
		startOfWeek.setHours(0, 0, 0, 0);
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		let dayTotal = 0;
		let weekTotal = 0;
		let monthTotal = 0;

		const filteredTransactions = transactions.filter(
			(t) => t.type === activeTab
		);

		filteredTransactions.forEach((transaction) => {
			const transactionDate = new Date(transaction.date);

			if (transactionDate >= startOfDay) {
				dayTotal += transaction.amount;
			}

			if (transactionDate >= startOfWeek) {
				weekTotal += transaction.amount;
			}

			if (transactionDate >= startOfMonth) {
				monthTotal += transaction.amount;
			}
		});

		return {
			day: dayTotal,
			week: weekTotal,
			month: monthTotal,
		};
	};

	const summaryData = calculateSummary();

	// Get filtered transactions
	const getFilteredTransactions = () => {
		return transactions
			.filter((t) => t.type === activeTab)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.menuButton}>
					<MaterialCommunityIcons name="menu" size={24} color="#333" />
				</TouchableOpacity>

				<View style={styles.balanceContainer}>
					<Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
					<TouchableOpacity style={styles.balanceDropdown}>
						<Text style={styles.balanceLabel}>Total Saldo</Text>
						<MaterialCommunityIcons
							name="chevron-down"
							size={16}
							color="#999"
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.notificationButton}>
					<MaterialCommunityIcons name="bell-outline" size={24} color="#333" />
				</TouchableOpacity>
			</View>

			{/* Tab Selector */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'EXPENSE' && styles.activeTab]}
					onPress={() => setActiveTab('EXPENSE')}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === 'EXPENSE' && styles.activeTabText,
						]}
					>
						Pengeluaran
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tab, activeTab === 'INCOME' && styles.activeTab]}
					onPress={() => setActiveTab('INCOME')}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === 'INCOME' && styles.activeTabText,
						]}
					>
						Pemasukan
					</Text>
				</TouchableOpacity>
			</View>

			{loading && !refreshing ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary.main} />
				</View>
			) : error ? (
				<View style={styles.errorContainer}>
					<MaterialCommunityIcons
						name="alert-circle-outline"
						size={48}
						color={colors.danger.main}
					/>
					<Text style={styles.errorText}>{error}</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={fetchTransactions}
					>
						<Text style={styles.retryButtonText}>Coba Lagi</Text>
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView
					style={styles.content}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={[colors.primary.main]}
							tintColor={colors.primary.main}
						/>
					}
				>
					{/* Summary */}
					<View style={styles.summaryContainer}>
						<View
							style={[styles.dailySummaryItem, { backgroundColor: '#FFF4D4' }]}
						>
							<Text style={[styles.summaryLabel, { color: '#B7934A' }]}>
								Hari
							</Text>
							<Text
								style={[
									styles.summaryValue,
									styles.dailyValue,
									{ color: '#8B7355' },
								]}
							>
								{formatCurrency(summaryData.day)}
							</Text>
						</View>
						<View style={styles.weekMonthContainer}>
							<View
								style={[
									styles.summaryItem,
									{ backgroundColor: '#E8F4FF', marginRight: 8 },
								]}
							>
								<Text style={[styles.summaryLabel, { color: '#5B8DB8' }]}>
									Minggu
								</Text>
								<Text style={[styles.summaryValue, { color: '#2C5282' }]}>
									{formatCurrency(summaryData.week)}
								</Text>
							</View>
							<View
								style={[styles.summaryItem, { backgroundColor: '#E7F5E8' }]}
							>
								<Text style={[styles.summaryLabel, { color: '#4A9D5B' }]}>
									Bulan
								</Text>
								<Text style={[styles.summaryValue, { color: '#276749' }]}>
									{formatCurrency(summaryData.month)}
								</Text>
							</View>
						</View>
					</View>

					{/* Recent Transactions */}
					<View style={styles.transactionsContainer}>
						<Text style={styles.transactionsTitle}>Transaksi Terbaru</Text>

						{getFilteredTransactions().length === 0 ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>Belum ada transaksi</Text>
							</View>
						) : (
							getFilteredTransactions().map((transaction) => (
								<TransactionCard
									key={transaction.id}
									transaction={transaction}
									onPress={() => {
										// Handle transaction press
									}}
								/>
							))
						)}
					</View>
				</ScrollView>
			)}

			{/* Bottom Navigation */}
			<BottomNavigation />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f7fa',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
	},
	menuButton: {
		padding: 8,
	},
	balanceContainer: {
		alignItems: 'center',
	},
	balanceAmount: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	balanceDropdown: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	balanceLabel: {
		fontSize: 14,
		color: '#999',
		marginRight: 4,
	},
	notificationButton: {
		padding: 8,
	},
	tabContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		marginTop: 16,
		marginBottom: 8,
	},
	tab: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		marginRight: 8,
	},
	activeTab: {
		backgroundColor: '#000',
	},
	tabText: {
		fontSize: 14,
		color: '#666',
	},
	activeTabText: {
		color: '#fff',
		fontWeight: '500',
	},
	periodContainer: {
		flexDirection: 'row',
		backgroundColor: '#f5f5f5',
		borderRadius: 30,
		padding: 4,
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 16,
	},
	periodTab: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 30,
		alignItems: 'center',
	},
	periodTabActive: {
		backgroundColor: '#fff',
	},
	periodTabInactive: {
		backgroundColor: 'transparent',
	},
	periodTabText: {
		fontSize: 14,
		color: '#999',
	},
	periodTabTextActive: {
		color: '#333',
		fontWeight: '500',
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingBottom: 80,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryContainer: {
		marginTop: 16,
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	dailySummaryItem: {
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	weekMonthContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	summaryItem: {
		flex: 1,
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	summaryLabel: {
		fontSize: 14,
		marginBottom: 8,
	},
	summaryValue: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	dailyValue: {
		fontSize: 32,
	},
	transactionsContainer: {
		marginBottom: 24,
	},
	transactionsTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 12,
	},
	emptyContainer: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	emptyText: {
		fontSize: 16,
		color: '#999',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		color: colors.text.secondary,
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 24,
	},
	retryButton: {
		backgroundColor: colors.primary.main,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	retryButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500',
	},
});

export default HomeScreen;
