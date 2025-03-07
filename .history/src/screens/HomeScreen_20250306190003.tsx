import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
	const navigation = useNavigation();
	const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [selectedMonth, setSelectedMonth] = useState('June');
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [balance, setBalance] = useState(0);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [error, setError] = useState<string | null>(null);

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
						onPress: () => fetchTransactions() 
					}
				]
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions, activeTab, selectedMonth]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchTransactions();
	}, [fetchTransactions]);

	// Prepare data for chart
	const prepareChartData = () => {
		// Group transactions by date
		const groupedData: { [key: string]: number } = {};
		const filteredTransactions = transactions.filter(
			(t) => t.type === activeTab
		);

		// Initialize days of the month
		for (let i = 1; i <= 31; i++) {
			groupedData[i.toString()] = 0;
		}

		// Sum transactions by day
		filteredTransactions.forEach((transaction) => {
			const date = new Date(transaction.date);
			const day = date.getDate().toString();
			groupedData[day] = (groupedData[day] || 0) + transaction.amount;
		});

		// Get data for chart
		const labels = ['1', '5', '10', '15', '20', '25', '31'];
		const data = labels.map((day) => groupedData[day] || 0);

		return {
			labels,
			datasets: [
				{
					data,
					colors: [
						(opacity = 1) => `rgba(255, 192, 192, ${opacity})`,
						(opacity = 1) => `rgba(192, 192, 255, ${opacity})`,
						(opacity = 1) => `rgba(255, 255, 192, ${opacity})`,
						(opacity = 1) => `rgba(192, 255, 192, ${opacity})`,
						(opacity = 1) => `rgba(255, 192, 255, ${opacity})`,
						(opacity = 1) => `rgba(192, 255, 255, ${opacity})`,
						(opacity = 1) => `rgba(255, 224, 192, ${opacity})`,
					],
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

			{loading && !refreshing ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary.main} />
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
					{/* Chart */}
					<View style={styles.chartContainer}>
						<BarChart
							data={chartData}
							width={width - 32}
							height={220}
							yAxisLabel=""
							yAxisSuffix=""
							chartConfig={{
								backgroundColor: '#fff',
								backgroundGradientFrom: '#fff',
								backgroundGradientTo: '#fff',
								decimalPlaces: 0,
								color: (opacity = 1, index = 0) =>
									chartData.datasets[0].colors[index % 7](opacity),
								labelColor: () => '#999',
								style: {
									borderRadius: 16,
								},
								barPercentage: 0.6,
							}}
							style={styles.chart}
							showBarTops={false}
							fromZero
							withInnerLines={false}
							showValuesOnTopOfBars
						/>
					</View>

					{/* Summary */}
					<View style={styles.summaryContainer}>
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Hari</Text>
							<Text style={styles.summaryValue}>
								{formatCurrency(summaryData.day).replace('Rp ', '')}
							</Text>
						</View>

						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Minggu</Text>
							<Text style={styles.summaryValue}>
								{formatCurrency(summaryData.week).replace('Rp ', '')}
							</Text>
						</View>

						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Bulan</Text>
							<Text style={styles.summaryValue}>
								{formatCurrency(summaryData.month).replace('Rp ', '')}
							</Text>
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
		marginTop: 16,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	summaryContainer: {
		flexDirection: 'row',
		marginTop: 16,
		marginBottom: 16,
	},
	summaryItem: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
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
