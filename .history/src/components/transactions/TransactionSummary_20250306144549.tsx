import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Transaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatCurrency';
import { colors } from '../../constants/colors';

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
					<Text style={styles.label}>Income</Text>
					<Text style={[styles.amount, styles.income]}>
						${income.toFixed(2)}
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Text style={styles.label}>Expense</Text>
					<Text style={[styles.amount, styles.expense]}>
						${expense.toFixed(2)}
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Text style={styles.label}>Balance</Text>
					<Text
						style={[
							styles.amount,
							balance >= 0 ? styles.income : styles.expense,
						]}
					>
						${Math.abs(balance).toFixed(2)}
					</Text>
				</View>
			</View>

			<View style={styles.chartContainer}>
				<Text style={styles.chartTitle}>Last 7 Days Balance</Text>
				<LineChart
					data={chartData}
					width={Dimensions.get('window').width - 32}
					height={220}
					chartConfig={{
						backgroundColor: '#fff',
						backgroundGradientFrom: '#fff',
						backgroundGradientTo: '#fff',
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
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
		shadowColor: '#000',
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
		color: '#666',
		marginBottom: 4,
	},
	amount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	income: {
		color: '#2ecc71',
	},
	expense: {
		color: '#e74c3c',
	},
	chartContainer: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 8,
		shadowColor: '#000',
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
		color: '#333',
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
});
