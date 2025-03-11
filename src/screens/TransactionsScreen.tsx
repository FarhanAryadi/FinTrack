import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	addDays,
	endOfWeek,
	format,
	isWithinInterval,
	startOfWeek,
	subDays,
} from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	FlatList,
	Modal,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomNavigation from '../components/navigation/BottomNavigation';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Transaction, TransactionSummary } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

const TransactionsScreen = () => {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [summary, setSummary] = useState<TransactionSummary | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);
	const [dateRange, setDateRange] = useState({
		startDate: startOfWeek(new Date()),
		endDate: endOfWeek(new Date()),
	});

	const fetchTransactions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Pastikan endDate adalah akhir hari
			const adjustedEndDate = new Date(dateRange.endDate);
			adjustedEndDate.setHours(23, 59, 59, 999);

			const summaryData = await transactionService.getTransactionSummary(
				dateRange.startDate,
				adjustedEndDate
			);

			setSummary(summaryData);
			setTransactions(summaryData.recentTransactions);
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
	}, [dateRange]);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchTransactions();
	}, [fetchTransactions]);

	const handlePreviousWeek = () => {
		setDateRange({
			startDate: subDays(dateRange.startDate, 7),
			endDate: subDays(dateRange.endDate, 7),
		});
	};

	const handleNextWeek = () => {
		setDateRange({
			startDate: addDays(dateRange.startDate, 7),
			endDate: addDays(dateRange.endDate, 7),
		});
	};

	const handleDeleteTransaction = async (id: string) => {
		try {
			await transactionService.deleteTransaction(id);
			fetchTransactions();
			Alert.alert('Sukses', 'Transaksi berhasil dihapus');
		} catch (error) {
			Alert.alert('Error', 'Gagal menghapus transaksi');
		}
	};

	const renderTransactionItem = ({ item }: { item: Transaction }) => {
		const getIconName = () => {
			if (item.type === 'INCOME') {
				return 'cash-multiple';
			}

			switch (item.category.toLowerCase()) {
				case 'food':
					return 'food';
				case 'bill':
					return 'file-document-outline';
				case 'fuel':
					return 'gas-station';
				case 'salary':
					return 'cash-multiple';
				case 'groceries':
					return 'cart';
				case 'traveling':
					return 'train-car';
				case 'entertainment':
					return 'movie-open';
				case 'house rent':
					return 'home';
				case 'medicines':
					return 'medical-bag';
				default:
					return 'dots-horizontal';
			}
		};

		return (
			<View style={styles.transactionItem}>
				<View
					style={[
						styles.transactionIconContainer,
						{
							backgroundColor:
								item.type === 'INCOME'
									? colors.success.surface
									: colors.danger.surface,
						},
					]}
				>
					<MaterialCommunityIcons
						name={getIconName()}
						size={24}
						color={
							item.type === 'INCOME'
								? colors.transaction.income.main
								: colors.transaction.expense.main
						}
					/>
				</View>
				<View style={styles.transactionDetails}>
					<Text style={styles.transactionCategory}>
						{item.Category?.name || item.category}
					</Text>
					<Text style={styles.transactionDescription}>
						{item.description || 'No description'}
					</Text>
				</View>
				<View style={styles.transactionAmountContainer}>
					<Text
						style={[
							styles.transactionAmount,
							{
								color:
									item.type === 'INCOME'
										? colors.transaction.income.main
										: colors.transaction.expense.main,
							},
						]}
					>
						{formatCurrency(item.amount)}
					</Text>
					<Text style={styles.transactionDate}>
						{format(new Date(item.date), 'dd-MMM-yyyy | hh:mm a')}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="menu"
							size={24}
							color={colors.text.inverse}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Wallet</Text>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="magnify"
							size={24}
							color={colors.text.inverse}
						/>
					</TouchableOpacity>
				</View>

				{/* Date Range Selector */}
				<TouchableOpacity
					style={styles.dateSelector}
					onPress={() => setShowCalendar(true)}
				>
					<MaterialCommunityIcons
						name="calendar"
						size={20}
						color={colors.text.primary}
					/>
					<Text style={styles.dateRangeText}>
						{format(dateRange.startDate, 'MMM dd')} -{' '}
						{format(dateRange.endDate, 'MMM dd, yyyy')}
					</Text>
					<View style={styles.dateNavigation}>
						<TouchableOpacity onPress={handlePreviousWeek}>
							<MaterialCommunityIcons
								name="chevron-left"
								size={20}
								color={colors.text.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleNextWeek}>
							<MaterialCommunityIcons
								name="chevron-right"
								size={20}
								color={colors.text.primary}
							/>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>

				{/* Summary Cards */}
				<View style={styles.summaryRow}>
					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>Total Income</Text>
						<Text style={styles.summaryValue}>
							{summary ? formatCurrency(summary.totalIncome) : '-'}
						</Text>
					</View>
					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>Total Expense</Text>
						<Text style={styles.summaryValue}>
							{summary ? formatCurrency(summary.totalExpense) : '-'}
						</Text>
					</View>
					<View style={[styles.summaryItem, styles.balanceItem]}>
						<Text style={styles.summaryLabel}>Balance</Text>
						<Text style={styles.summaryValue}>
							{summary ? formatCurrency(summary.balance) : '-'}
						</Text>
					</View>
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
				<FlatList
					data={transactions}
					renderItem={renderTransactionItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.transactionsList}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={[colors.primary.main]}
							tintColor={colors.primary.main}
						/>
					}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>
								Tidak ada transaksi pada periode ini
							</Text>
						</View>
					}
				/>
			)}

			{/* Calendar Modal */}
			<Modal
				visible={showCalendar}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowCalendar(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.calendarContainer}>
						<View style={styles.calendarHeader}>
							<Text style={styles.calendarTitle}>Select Date Range</Text>
							<TouchableOpacity onPress={() => setShowCalendar(false)}>
								<MaterialCommunityIcons
									name="close"
									size={24}
									color={colors.text.primary}
								/>
							</TouchableOpacity>
						</View>
						<Calendar
							markingType={'period'}
							markedDates={{
								[format(dateRange.startDate, 'yyyy-MM-dd')]: {
									startingDay: true,
									color: colors.primary.main,
									textColor: colors.text.inverse,
								},
								[format(dateRange.endDate, 'yyyy-MM-dd')]: {
									endingDay: true,
									color: colors.primary.main,
									textColor: colors.text.inverse,
								},
							}}
							onDayPress={(day: { timestamp: number }) => {
								const selectedDate = new Date(day.timestamp);
								if (
									!dateRange.startDate ||
									(dateRange.startDate && dateRange.endDate)
								) {
									// Start new selection
									setDateRange({
										startDate: selectedDate,
										endDate: selectedDate,
									});
								} else {
									// Complete the selection
									if (selectedDate < dateRange.startDate) {
										setDateRange({
											startDate: selectedDate,
											endDate: dateRange.startDate,
										});
									} else {
										setDateRange({
											startDate: dateRange.startDate,
											endDate: selectedDate,
										});
									}
									setShowCalendar(false);
								}
							}}
							theme={{
								todayTextColor: colors.primary.main,
								arrowColor: colors.primary.main,
							}}
						/>
					</View>
				</View>
			</Modal>

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
		paddingTop: 40,
		paddingBottom: 20,
	},
	headerTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.inverse,
	},
	dateSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: colors.card,
		borderRadius: 8,
		padding: 10,
		marginHorizontal: 16,
		marginBottom: 16,
	},
	dateRangeText: {
		flex: 1,
		fontSize: 14,
		color: colors.text.primary,
		marginLeft: 8,
	},
	dateNavigation: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
	},
	summaryItem: {
		backgroundColor: colors.card,
		borderRadius: 8,
		padding: 10,
		width: '31%',
		alignItems: 'center',
	},
	balanceItem: {
		backgroundColor: colors.text.primary,
	},
	summaryLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginBottom: 4,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: 'bold',
		color: colors.text.secondary,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	transactionsList: {
		padding: 16,
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
	emptyContainer: {
		backgroundColor: colors.card,
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		marginTop: 20,
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
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	calendarContainer: {
		backgroundColor: colors.card,
		borderRadius: 16,
		padding: 16,
		width: width - 32,
	},
	calendarHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	calendarTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.text.primary,
	},
});

export default TransactionsScreen;
