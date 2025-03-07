import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Header } from '../components/common/Header';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';

const HomeScreen: React.FC = () => {
	const { transactions, isLoading, error, fetchTransactions } =
		useTransactions();

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const totalBalance = transactions.reduce((acc, curr) => {
		return acc + (curr.type === 'INCOME' ? curr.amount : -curr.amount);
	}, 0);
	const formattedBalance = formatCurrency(totalBalance);

	const renderTransaction = ({ item }: { item: Transaction }) => (
		<TransactionCard
			transaction={item}
			onPress={(transaction) => {
				// Handle transaction press
				console.log('Transaction pressed:', transaction);
			}}
		/>
	);

	return (
		<View style={styles.container}>
			<Header
				title="My Wallet"
				subtitle="Current Balance"
				amount={totalBalance}
			/>
			<FlatList
				data={transactions}
				renderItem={renderTransaction}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={fetchTransactions}
						tintColor="#6366f1"
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	listContent: {
		paddingVertical: 16,
	},
});

export default HomeScreen;
