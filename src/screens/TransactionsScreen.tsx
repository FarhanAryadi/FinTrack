import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionSummary } from '../components/transactions/TransactionSummary';
import { useTransactions } from '../hooks/useTransactions';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Transaction } from '../types/transaction';

export const TransactionsScreen: React.FC = () => {
	const {
		transactions,
		isLoading,
		error,
		fetchTransactions,
		deleteTransaction
	} = useTransactions();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchTransactions();
		setIsRefreshing(false);
	};

	useFocusEffect(
		useCallback(() => {
			fetchTransactions();
		}, [fetchTransactions])
	);

	const handleTransactionPress = async (transaction: Transaction) => {
		// Implementasi untuk menghapus transaksi
		if (confirm('Do you want to delete this transaction?')) {
			try {
				await deleteTransaction(transaction.id);
				alert('Transaction deleted successfully');
			} catch (error) {
				alert('Failed to delete transaction');
			}
		}
	};

	return (
		<View style={styles.container}>
			<TransactionSummary transactions={transactions} />
			<TransactionList
				transactions={transactions}
				isLoading={isLoading}
				onRefresh={handleRefresh}
				isRefreshing={isRefreshing}
				onTransactionPress={handleTransactionPress}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
});
