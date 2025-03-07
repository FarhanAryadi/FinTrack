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
import { BarChart } from 'react-native-chart-kit';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
	const navigation = useNavigation();
	const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('INCOME');
	const [selectedMonth, setSelectedMonth] = useState('Feb');
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [balance, setBalance] = useState(0);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(1);
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

			// Show error alert
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

	// Prepare data for chart
	const prepareChartData = () => {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];

		// Initialize data arrays for income and expense
		const incomeData = Array(12).fill(0);
		const expenseData = Array(12).fill(0);

		// Group transactions by month
		transactions.forEach((transaction) => {
			const transactionDate = new Date(transaction.date);
			const month = transactionDate.getMonth();

			if (transaction.type === 'INCOME') {
				incomeData[month] += transaction.amount;
			} else {
				expenseData[month] += transaction.amount;
			}
		});

		// Get the data array based on active tab
		const data = activeTab === 'INCOME' ? incomeData : expenseData;

		return {
			labels: months,
			datasets: [
				{
					data: data,
				},
			],
		};
	};

	const chartData = prepareChartData();

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
			.slice(0, 5); // Show only the 5 most recent transactions
	};

	// Get the value for the tooltip
	const getTooltipValue = () => {
		if (
			selectedBarIndex !== null &&
			chartData.datasets[0].data[selectedBarIndex]
		) {
			return formatCurrency(chartData.datasets[0].data[selectedBarIndex]);
		}
		return '';
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

				<TouchableOpacity style={styles.monthSelector}>
					<Text style={styles.monthText}>{selectedMonth}</Text>
					<MaterialCommunityIcons name="chevron-down" size={20} color="#333" />
				</TouchableOpacity>
			</View>

			{/* Period Selector */}
			<View style={styles.periodContainer}>
				<TouchableOpacity
					style={[
						styles.periodTab,
						activePeriod === 'daily'
							? styles.periodTabActive
							: styles.periodTabInactive,
					]}
					onPress={() => setActivePeriod('daily')}
				>
					<Text
						style={[
							styles.periodTabText,
							activePeriod === 'daily' && styles.periodTabTextActive,
						]}
					>
						Daily
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.periodTab,
						activePeriod === 'monthly'
							? styles.periodTabActive
							: styles.periodTabInactive,
					]}
					onPress={() => setActivePeriod('monthly')}
				>
					<Text
						style={[
							styles.periodTabText,
							activePeriod === 'monthly' && styles.periodTabTextActive,
						]}
					>
						Monthly
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.periodTab,
						activePeriod === 'yearly'
							? styles.periodTabActive
							: styles.periodTabInactive,
					]}
					onPress={() => setActivePeriod('yearly')}
				>
					<Text
						style={[
							styles.periodTabText,
							activePeriod === 'yearly' && styles.periodTabTextActive,
						]}
					>
						Yearly
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
						<View style={styles.dailySummaryItem}>
							<Text style={styles.summaryLabel}>Hari</Text>
							<Text style={[styles.summaryValue, styles.dailyValue]}>
								{formatCurrency(summaryData.day)}
							</Text>
						</View>
						<View style={styles.weekMonthContainer}>
							<View style={styles.summaryItem}>
								<Text style={styles.summaryLabel}>Minggu</Text>
								<Text style={styles.summaryValue}>
									{formatCurrency(summaryData.week)}
								</Text>
							</View>
							<View style={styles.summaryItem}>
								<Text style={styles.summaryLabel}>Bulan</Text>
								<Text style={styles.summaryValue}>
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

			{/* Floating Action Button */}
			<TouchableOpacity
				style={styles.fab}
				onPress={() => navigation.navigate('Add' as never)}
			>
				<MaterialCommunityIcons name="plus" size={24} color="#fff" />
			</TouchableOpacity>
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
	monthSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 'auto',
		backgroundColor: '#f0f0f0',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
	},
	monthText: {
		fontSize: 14,
		color: '#333',
		marginRight: 4,
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
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	chartContainer: {
		marginTop: 8,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	chartContent: {
		position: 'relative',
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	tooltip: {
		position: 'absolute',
		backgroundColor: '#333',
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		zIndex: 1000,
	},
	tooltipText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
	},
	legendContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 8,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 12,
	},
	legendDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 6,
	},
	legendText: {
		fontSize: 12,
		color: '#666',
	},
	summaryContainer: {
		marginTop: 16,
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	dailySummaryItem: {
		backgroundColor: '#fff',
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
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		marginHorizontal: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#999',
		marginBottom: 8,
	},
	summaryValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
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
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary.main,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
});

export default HomeScreen;
