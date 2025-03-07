import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../constants/colors';
import { Transaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatCurrency';

interface TransactionSummaryProps {
	transactions: Transaction[];
	period?: 'week' | 'month' | 'year';
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
	transactions,
	period = 'week',
}) => {
	const calculateTotals = () => {
		const income = transactions
			.filter((t) => t.type === 'INCOME')
			.reduce((sum, t) => sum + t.amount, 0);

		const expense = transactions
			.filter((t) => t.type === 'EXPENSE')
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			income,
			expense,
			balance: income - expense,
		};
	};

	const prepareChartData = () => {
		// Group transactions by date
		const groupedData = transactions.reduce(
			(acc: { [key: string]: number }, transaction) => {
				const date = new Date(transaction.date).toLocaleDateString();
				if (!acc[date]) {
					acc[date] = 0;
				}
				acc[date] +=
					transaction.type === 'INCOME'
						? transaction.amount
						: -transaction.amount;
				return acc;
			},
			{}
		);

		// Get last 7 days
		const dates = [];
		const values = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toLocaleDateString();
			dates.push(dateStr.split('/')[1]); // Only show day
			values.push(groupedData[dateStr] || 0);
		}

		return {
			labels: dates,
			datasets: [{ data: values }],
		};
	};

	const { income, expense, balance } = calculateTotals();
	const chartData = prepareChartData();

	return (
		<View style={styles.container}>
			<View style={styles.summaryContainer}>
				<View style={styles.summaryItem}>
					<Text style={styles.label}>Pemasukan</Text>
					<Text style={[styles.amount, styles.income]}>
						{formatCurrency(income)}
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Text style={styles.label}>Pengeluaran</Text>
					<Text style={[styles.amount, styles.expense]}>
						{formatCurrency(expense)}
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Text style={styles.label}>Saldo</Text>
					<Text
						style={[
							styles.amount,
							balance >= 0 ? styles.income : styles.expense,
						]}
					>
						{formatCurrency(Math.abs(balance))}
					</Text>
				</View>
			</View>

			<View style={styles.chartContainer}>
				<Text style={styles.chartTitle}>Saldo 7 Hari Terakhir</Text>
				<LineChart
					data={chartData}
					width={Dimensions.get('window').width - 32}
					height={220}
					chartConfig={{
						backgroundColor: colors.card,
						backgroundGradientFrom: colors.card,
						backgroundGradientTo: colors.card,
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						style: {
							borderRadius: 16,
						},
						propsForDots: {
							r: '6',
							strokeWidth: '2',
							stroke: '#007AFF',
						},
					}}
					bezier
					style={styles.chart}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	summaryContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: colors.card,
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	summaryItem: {
		flex: 1,
		alignItems: 'center',
	},
	label: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: 4,
	},
	amount: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	income: {
		color: colors.success.main,
	},
	expense: {
		color: colors.danger.main,
	},
	chartContainer: {
		backgroundColor: colors.card,
		padding: 16,
		borderRadius: 16,
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	chartTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
		color: colors.text.primary,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
});
