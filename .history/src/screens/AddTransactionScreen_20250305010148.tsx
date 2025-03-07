import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionFormData } from '../types/transaction';
import { useTransactions } from '../hooks/useTransactions';

export const AddTransactionScreen: React.FC = () => {
	const navigation = useNavigation();
	const { createTransaction } = useTransactions();

	const handleSubmit = async (data: TransactionFormData) => {
		try {
			await createTransaction(data);
			Alert.alert(
				'Success',
				'Transaction added successfully',
				[
					{
						text: 'OK',
						onPress: () => {
							// Navigasi ke tab Transactions
							navigation.navigate('Transactions', {
								screen: 'TransactionsList'
							});
						}
					}
				]
			);
		} catch (error) {
			console.error('Error creating transaction:', error);
			Alert.alert('Error', 'Failed to create transaction');
		}
	};

	return (
		<ScrollView style={styles.container}>
			<TransactionForm onSubmit={handleSubmit} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
});
