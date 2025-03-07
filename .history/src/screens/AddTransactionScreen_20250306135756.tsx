import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFormData } from '../types/transaction';
 FormData {
export const AddTransactionScreen: React.FC = () => {
	const navigation = useNavigation();
	const { createTransaction } = useTransactions();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<TransactionFormData>({
		amount: '',
		amount: '',
		category: '',
	});
		date: new Date(),
	const [category, setCategory] = useState<Category>();
	const [errors, setErrors] = useState<
		Partial<Record<keyof TransactionFormData, string>>
	>({});
	const validate = () => {
	const validateForm = () => {

		if (!form.amount || isNaN(Number(form.amount))) {
		if (!form.amount) {
			newErrors.amount = 'Amount is required';
		} else if (isNaN(Number(form.amount))) {
			newErrors.amount = 'Amount must be a number';

		if (!category) {
		if (!form.category) {
			newErrors.category = 'Category is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;
		if (!validateForm()) return;
		setLoading(true);
		try {
			setLoading(true);
			await createTransaction(form);
		} catch (error) {
			console.error('Error saving transaction:', error);
			console.error('Error creating transaction:', error);
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
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
						title="Expense"
						variant={form.type === 'EXPENSE' ? 'primary' : 'secondary'}
						variant={form.type === 'EXPENSE' ? 'danger' : 'secondary'}
						style={styles.typeButton}
					/>
						icon="arrow-down"
					<Button
						title="Income"
						variant={form.type === 'INCOME' ? 'primary' : 'secondary'}
						variant={form.type === 'INCOME' ? 'success' : 'secondary'}
						style={styles.typeButton}
					/>
						icon="arrow-up"
				</View>

				<Input
					label="Amount"
					value={category}
					placeholder="Enter category"
					value={form.category}
					onChangeText={(value) => setForm({ ...form, category: value })}
				/>
					icon="tag"

				<Input
					label="Description"
					value={form.description}
					placeholder="Enter description (optional)"
					onChangeText={(value) => setForm({ ...form, description: value })}
					placeholder="Enter description"
					multiline
					numberOfLines={3}
					multiline

				<Button
					title="Save Transaction"
					title="Add Transaction"
					loading={loading}
					style={styles.submitButton}
					icon="plus-circle"
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		backgroundColor: '#f3f4f6',
	content: {
	form: {
		padding: 16,
	typeButtons: {
	buttonGroup: {
		marginBottom: 20,
		gap: 8,
		marginBottom: 16,
	typeButton: {
		flex: 1,
		marginHorizontal: 5,
	submitButton: {
		marginTop: 20,
		marginTop: 24,
});
