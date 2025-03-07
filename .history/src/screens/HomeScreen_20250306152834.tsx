import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
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
	const [balance, setBalance] = useState(32500000); // Contoh saldo

	useEffect(() => {
		fetchTransactions();
	}, [activeTab, selectedMonth]);

	const fetchTransactions = async () => {
		try {
			setLoading(true);
			const data = await transactionService.getTransactions();
			// Filter berdasarkan tipe dan bulan jika diperlukan
			setTransactions(data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setLoading(false);
		}
	};

	// Data untuk grafik batang
	const chartData = {
		labels: ['1', '5', '10', '15', '20', '25', '31'],
		datasets: [
			{
				data: [12, 3, 5, 32, 21, 7, 13, 5],
				colors: [
					(opacity = 1) => `rgba(255, 192, 192, ${opacity})`,
					(opacity = 1) => `rgba(192, 192, 255, ${opacity})`,
					(opacity = 1) => `rgba(255, 255, 192, ${opacity})`,
					(opacity = 1) => `rgba(192, 255, 192, ${opacity})`,
					(opacity = 1) => `rgba(255, 192, 255, ${opacity})`,
					(opacity = 1) => `rgba(192, 255, 255, ${opacity})`,
					(opacity = 1) => `rgba(255, 224, 192, ${opacity})`,
					(opacity = 1) => `rgba(224, 224, 224, ${opacity})`,
				],
			},
		],
	};

	// Contoh data ringkasan
	const summaryData = {
		day: 52,
		week: 403,
		month: 1612,
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

			<ScrollView style={styles.content}>
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
								chartData.datasets[0].colors[index % 8](opacity),
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
							{formatCurrency(summaryData.day * 1000).replace('Rp ', '')}
						</Text>
					</View>

					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>Minggu</Text>
						<Text style={styles.summaryValue}>
							{formatCurrency(summaryData.week * 1000).replace('Rp ', '')}
						</Text>
					</View>

					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>Bulan</Text>
						<Text style={styles.summaryValue}>
							{formatCurrency(summaryData.month * 1000).replace('Rp ', '')}
						</Text>
					</View>
				</View>
			</ScrollView>

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
		marginBottom: 24,
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
