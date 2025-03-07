import React from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Transaction } from '../../types/transaction';

interface TransactionListProps {
	transactions: Transaction[];
	onTransactionPress?: (transaction: Transaction) => void;
	isLoading?: boolean;
	onRefresh?: () => void;
	isRefreshing?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
	transactions,
	onTransactionPress,
	isLoading,
	onRefresh,
	isRefreshing,
}) => {
	if (isLoading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#007AFF" />
			</View>
		);
	}

	const renderItem = ({ item }: { item: Transaction }) => (
		<TouchableOpacity
			style={styles.transactionItem}
			onPress={() => onTransactionPress?.(item)}
		>
			<View style={styles.transactionHeader}>
				<View style={styles.categoryContainer}>
					<Text style={styles.category}>{item.category}</Text>
					{item.description && (
						<Text style={styles.description} numberOfLines={1}>
							{item.description}
						</Text>
					)}
				</View>
				<View style={styles.amountContainer}>
					<Text
						style={[
							styles.amount,
							item.type === 'INCOME' ? styles.income : styles.expense,
						]}
					>
						{item.type === 'INCOME' ? '+' : '-'}$
						{Math.abs(item.amount).toFixed(2)}
					</Text>
					<Text style={styles.date}>
						{new Date(item.date).toLocaleDateString()}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	if (transactions.length === 0) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.emptyText}>No transactions yet</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={transactions}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			style={styles.container}
			refreshing={isRefreshing}
			onRefresh={onRefresh}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	transactionItem: {
		backgroundColor: '#fff',
		padding: 16,
		marginVertical: 4,
		marginHorizontal: 16,
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
	transactionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	categoryContainer: {
		flex: 1,
		marginRight: 16,
	},
	category: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
		color: '#666',
	},
	amountContainer: {
		alignItems: 'flex-end',
	},
	amount: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	income: {
		color: '#2ecc71',
	},
	expense: {
		color: '#e74c3c',
	},
	date: {
		fontSize: 12,
		color: '#999',
	},
	emptyText: {
		fontSize: 16,
		color: '#666',
	},
});
