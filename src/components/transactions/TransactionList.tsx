import React from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { Transaction } from '../../types/transaction';
import { TransactionCard } from './TransactionCard';

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
				<ActivityIndicator size="large" color={colors.primary.main} />
			</View>
		);
	}

	const renderItem = ({ item }: { item: Transaction }) => (
		<TransactionCard transaction={item} onPress={onTransactionPress} />
	);

	if (transactions.length === 0) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.emptyText}>Belum ada transaksi</Text>
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
			contentContainerStyle={styles.listContent}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	listContent: {
		paddingVertical: 8,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 16,
		color: colors.text.secondary,
	},
});
