import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../components/common/Button';
import { CategoryDropdown } from '../components/common/CategoryDropdown';
import { CurrencyInput } from '../components/common/CurrencyInput';
import { Input } from '../components/common/Input';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Category } from '../types/category';
import { RootStackParamList } from '../types/navigation';

interface FormData {
	type: 'INCOME' | 'EXPENSE';
	amount: string;
	description: string;
}

type AddTransactionScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Add'>;
};

export const AddTransactionScreen = ({
	navigation,
}: AddTransactionScreenProps) => {
	const [form, setForm] = useState<FormData>({
		type: 'EXPENSE',
		amount: '',
		description: '',
	});
	const [category, setCategory] = useState<Category>();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{
		amount?: string;
		category?: string;
		description?: string;
	}>({});

	const validate = () => {
		const newErrors: typeof errors = {};

		if (
			!form.amount ||
			isNaN(Number(form.amount)) ||
			Number(form.amount) <= 0
		) {
			newErrors.amount = 'Masukkan jumlah yang valid';
		}

		if (!category) {
			newErrors.category = 'Pilih kategori';
		}

		if (!form.description.trim()) {
			newErrors.description = 'Masukkan deskripsi';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setLoading(true);
		try {
			await transactionService.createTransaction({
				type: form.type,
				amount: Number(form.amount),
				description: form.description.trim(),
				categoryId: category!.id.toString(),
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error saving transaction:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.typeButtons}>
					<Button
						title="Pengeluaran"
						variant={form.type === 'EXPENSE' ? 'danger' : 'secondary'}
						onPress={() => setForm({ ...form, type: 'EXPENSE' })}
						style={styles.typeButton}
						icon="arrow-down"
					/>
					<Button
						title="Pemasukan"
						variant={form.type === 'INCOME' ? 'success' : 'secondary'}
						onPress={() => setForm({ ...form, type: 'INCOME' })}
						style={styles.typeButton}
						icon="arrow-up"
					/>
				</View>

				<CurrencyInput
					label="Jumlah"
					value={form.amount}
					onChangeText={(value) => setForm({ ...form, amount: value })}
					error={errors.amount}
					icon="cash"
				/>

				<CategoryDropdown
					label="Kategori"
					value={category}
					onChange={setCategory}
					type={form.type}
					error={errors.category}
				/>

				<Input
					label="Deskripsi"
					value={form.description}
					onChangeText={(value) => setForm({ ...form, description: value })}
					placeholder="Masukkan deskripsi"
					error={errors.description}
					icon="text"
					multiline
				/>

				<Button
					title="Simpan Transaksi"
					onPress={handleSubmit}
					loading={loading}
					icon="check"
					style={styles.submitButton}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		padding: 20,
	},
	typeButtons: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	typeButton: {
		flex: 1,
		marginHorizontal: 5,
	},
	submitButton: {
		marginTop: 20,
	},
});
