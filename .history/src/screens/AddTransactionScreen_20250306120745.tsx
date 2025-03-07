import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFormData } from '../types/transaction';

export const AddTransactionScreen: React.FC = () => {
	const navigation = useNavigation();
	const { createTransaction } = useTransactions();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<TransactionFormData>({
		amount: '',
		type: 'EXPENSE',
		category: '',
		description: '',
		date: new Date(),
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof TransactionFormData, string>>
	>({});

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (!form.amount) {
			newErrors.amount = 'Amount is required';
		} else if (isNaN(Number(form.amount))) {
			newErrors.amount = 'Amount must be a number';
		}

		if (!form.category) {
			newErrors.category = 'Category is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			setLoading(true);
			await createTransaction(form);
			navigation.goBack();
		} catch (error) {
			console.error('Error creating transaction:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.form}>
				<Input
					label="Amount"
					placeholder="Enter amount"
					keyboardType="numeric"
					value={form.amount}
					onChangeText={(value) => setForm({ ...form, amount: value })}
					error={errors.amount}
					icon="cash"
				/>

				<View style={styles.buttonGroup}>
					<Button
						title="Expense"
						variant={form.type === 'EXPENSE' ? 'danger' : 'secondary'}
						onPress={() => setForm({ ...form, type: 'EXPENSE' })}
						style={styles.typeButton}
						icon="arrow-down"
					/>
					<Button
						title="Income"
						variant={form.type === 'INCOME' ? 'success' : 'secondary'}
						onPress={() => setForm({ ...form, type: 'INCOME' })}
						style={styles.typeButton}
						icon="arrow-up"
					/>
				</View>

				<Input
					label="Category"
					placeholder="Enter category"
					value={form.category}
					onChangeText={(value) => setForm({ ...form, category: value })}
					error={errors.category}
					icon="tag"
				/>

				<Input
					label="Description"
					placeholder="Enter description (optional)"
					value={form.description}
					onChangeText={(value) => setForm({ ...form, description: value })}
					multiline
					numberOfLines={3}
					icon="text"
				/>

				<Button
					title="Add Transaction"
					onPress={handleSubmit}
					loading={loading}
					icon="plus-circle"
					style={styles.submitButton}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	form: {
		padding: 16,
	},
	buttonGroup: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 16,
	},
	typeButton: {
		flex: 1,
	},
	submitButton: {
		marginTop: 24,
	},
});
