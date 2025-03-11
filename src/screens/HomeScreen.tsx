import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
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

	// Get recent transactions
	const getRecentTransactions = () => {
		return transactions
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	};

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={colors.primary.main}
			/>

			{/* Header */}
			<View style={styles.header}>
				{/* <View style={styles.headerTop}>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="menu"
							size={24}
							color={colors.text.inverse}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						Wallet{' '}
						<MaterialCommunityIcons
							name="chevron-down"
							size={20}
							color={colors.text.inverse}
						/>
					</Text>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="bell-outline"
							size={24}
							color={colors.text.inverse}
						/>
					</TouchableOpacity>
				</View> */}

				<View style={styles.balanceSection}>
					<Text style={styles.balanceLabel}>Account Balance</Text>
					<Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
				</View>
			</View>

			{/* Summary Cards */}
			<View style={styles.summaryRow}>
				<View style={[styles.summaryItem, styles.incomeItem]}>
					<Text style={styles.summaryLabel}>Total Income</Text>
					<Text style={styles.summaryValue}>{formatCurrency(income)}</Text>
				</View>
				<View style={[styles.summaryItem, styles.expenseItem]}>
					<Text style={styles.summaryLabel}>Total Expense</Text>
					<Text style={styles.summaryValue}>{formatCurrency(expense)}</Text>
				</View>
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
					{/* Chart Section */}
					<View style={styles.chartSection}>
						<View style={styles.chartContainer}>
							{/* Simplified Bar Chart */}
							<View style={styles.barChartContainer}>
								{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(
									(month, index) => (
										<View key={index} style={styles.barColumn}>
											<View style={styles.barGroup}>
												{/* Income bar */}
												<View
													style={[
														styles.bar,
														styles.incomeBar,
														{ height: [70, 90, 60, 80, 40, 100, 60][index] },
													]}
												/>
												{/* Expense bar */}
												<View
													style={[
														styles.bar,
														styles.expenseBar,
														{ height: [50, 60, 40, 30, 80, 50, 30][index] },
													]}
												/>
												{/* Highlight for June */}
												{month === 'Jun' && (
													<View style={styles.barHighlight}>
														<Text style={styles.barHighlightText}>Rp 75,000</Text>
													</View>
												)}
											</View>
											<Text style={styles.barLabel}>{month}</Text>
										</View>
									)
								)}
							</View>

							{/* Y-axis labels */}
							<View style={styles.yAxisLabels}>
								<Text style={styles.yAxisLabel}>25k</Text>
								<Text style={styles.yAxisLabel}>20k</Text>
								<Text style={styles.yAxisLabel}>15k</Text>
								<Text style={styles.yAxisLabel}>10k</Text>
								<Text style={styles.yAxisLabel}>5k</Text>
								<Text style={styles.yAxisLabel}>0k</Text>
							</View>
						</View>
					</View>

					{/* Recent Transactions */}
					<View style={styles.transactionsSection}>
						<View style={styles.transactionsHeader}>
							<Text style={styles.transactionsTitle}>Recent Transaction</Text>
							<TouchableOpacity>
								<Text style={styles.viewAllText}>View all</Text>
							</TouchableOpacity>
						</View>

						{getRecentTransactions().length === 0 ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>Belum ada transaksi</Text>
							</View>
						) : (
							getRecentTransactions().map((transaction) => (
								<View key={transaction.id} style={styles.transactionItem}>
									<View
										style={[
											styles.transactionIconContainer,
											{
												backgroundColor:
													transaction.type === 'INCOME'
														? colors.success.surface
														: colors.danger.surface,
											},
										]}
									>
										<MaterialCommunityIcons
											name={
												transaction.type === 'INCOME' ? 'cash-multiple' : 'food'
											}
											size={24}
											color={
												transaction.type === 'INCOME'
													? colors.transaction.income.main
													: colors.transaction.expense.main
											}
										/>
									</View>
									<View style={styles.transactionDetails}>
										<Text style={styles.transactionCategory}>
											{transaction.Category?.name || transaction.category}
										</Text>
										<Text style={styles.transactionDescription}>
											{transaction.description || 'No description'}
										</Text>
									</View>
									<View style={styles.transactionAmountContainer}>
										<Text
											style={[
												styles.transactionAmount,
												{
													color:
														transaction.type === 'INCOME'
															? colors.transaction.income.main
															: colors.transaction.expense.main,
												},
											]}
										>
											{transaction.type === 'INCOME' ? '' : '-'}
											{formatCurrency(transaction.amount)}
										</Text>
										<Text style={styles.transactionDate}>
											{format(
												new Date(transaction.date),
												'dd-MMM-yyyy | hh:mm a'
											)}
										</Text>
									</View>
								</View>
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
		backgroundColor: colors.background,
	},
	header: {
		backgroundColor: colors.primary.main,
		paddingTop: 80,
		paddingBottom: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.inverse,
	},
	balanceSection: {
		paddingHorizontal: 16,
		top: -40,
		alignItems: 'center',
	},
	balanceLabel: {
		fontSize: 14,
		color: colors.text.inverse,
		marginBottom: 8,
	},
	balanceAmount: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.text.inverse,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginTop: -20,
		marginBottom: 20,
		zIndex: 10,
	},
	summaryItem: {
		borderRadius: 10,
		padding: 12,
		width: '45%',
		marginVertical: -15,
		marginHorizontal: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	incomeItem: {
		backgroundColor: colors.success.main,
	},
	expenseItem: {
		backgroundColor: colors.danger.main,
	},
	summaryLabel: {
		fontSize: 15,
		color: colors.text.inverse,
		marginBottom: 4,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: 'bold',
		color: colors.text.inverse,
	},
	content: {
		flex: 1,
	},
	chartSection: {
		backgroundColor: colors.card,
		borderRadius: 15,
		margin: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	chartContainer: {
		flexDirection: 'row',
		height: 180,
		marginTop: 10,
	},
	barChartContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-around',
		paddingLeft: 30,
	},
	barColumn: {
		alignItems: 'center',
		width: 30,
	},
	barGroup: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
		width: '100%',
	},
	bar: {
		width: 8,
		borderRadius: 4,
		marginHorizontal: 1,
	},
	incomeBar: {
		backgroundColor: colors.success.main,
	},
	expenseBar: {
		backgroundColor: colors.primary.light,
	},
	barHighlight: {
		position: 'absolute',
		top: -25,
		backgroundColor: colors.text.primary,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	barHighlightText: {
		color: colors.text.inverse,
		fontSize: 10,
		fontWeight: 'bold',
	},
	barLabel: {
		fontSize: 10,
		color: colors.text.secondary,
		marginTop: 5,
	},
	yAxisLabels: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 20,
		justifyContent: 'space-between',
	},
	yAxisLabel: {
		fontSize: 10,
		color: colors.text.secondary,
		width: 30,
	},
	transactionsSection: {
		marginHorizontal: 16,
		marginTop: 0,
	},
	transactionsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	transactionsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.text.primary,
	},
	viewAllText: {
		fontSize: 12,
		color: colors.primary.main,
	},
	transactionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.card,
		borderRadius: 12,
		padding: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	transactionIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	transactionDetails: {
		flex: 1,
	},
	transactionCategory: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text.primary,
	},
	transactionDescription: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: 2,
	},
	transactionAmountContainer: {
		alignItems: 'flex-end',
	},
	transactionAmount: {
		fontSize: 14,
		fontWeight: '600',
	},
	transactionDate: {
		fontSize: 10,
		color: colors.text.secondary,
		marginTop: 2,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyContainer: {
		backgroundColor: colors.card,
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 16,
		color: colors.text.secondary,
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
		color: colors.text.inverse,
		fontSize: 16,
		fontWeight: '500',
	},
});

export default HomeScreen;
