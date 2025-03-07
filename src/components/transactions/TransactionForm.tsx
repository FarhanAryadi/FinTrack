import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { TransactionFormData, TransactionType } from '../../types/transaction';

interface TransactionFormProps {
	onSubmit: (data: TransactionFormData) => void;
	initialValues?: Partial<TransactionFormData>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
	onSubmit,
	initialValues = {},
}) => {
	const [formData, setFormData] = useState<TransactionFormData>({
		amount: initialValues.amount || '',
		type: initialValues.type || 'EXPENSE',
		category: initialValues.category || '',
		description: initialValues.description || '',
		date: initialValues.date || new Date(),
	});

	const [showDatePicker, setShowDatePicker] = useState(false);

	const handleSubmit = () => {
		if (!formData.amount || !formData.category) {
			alert('Please fill in all required fields');
			return;
		}
		onSubmit(formData);
	};

	const onDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (selectedDate) {
			setFormData({ ...formData, date: selectedDate });
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Amount"
				keyboardType="numeric"
				value={formData.amount}
				onChangeText={(value) => setFormData({ ...formData, amount: value })}
			/>

			<View style={styles.typeContainer}>
				<TouchableOpacity
					style={[
						styles.typeButton,
						formData.type === 'EXPENSE' && styles.activeButton,
					]}
					onPress={() => setFormData({ ...formData, type: 'EXPENSE' })}
				>
					<Text
						style={[
							styles.buttonText,
							formData.type === 'EXPENSE' && styles.activeButtonText,
						]}
					>
						Expense
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.typeButton,
						formData.type === 'INCOME' && styles.activeButton,
					]}
					onPress={() => setFormData({ ...formData, type: 'INCOME' })}
				>
					<Text
						style={[
							styles.buttonText,
							formData.type === 'INCOME' && styles.activeButtonText,
						]}
					>
						Income
					</Text>
				</TouchableOpacity>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Category"
				value={formData.category}
				onChangeText={(value) => setFormData({ ...formData, category: value })}
			/>

			<TextInput
				style={styles.input}
				placeholder="Description (optional)"
				value={formData.description}
				onChangeText={(value) =>
					setFormData({ ...formData, description: value })
				}
				multiline
			/>

			<TouchableOpacity
				style={styles.dateButton}
				onPress={() => setShowDatePicker(true)}
			>
				<Text style={styles.dateButtonText}>
					Date: {formData.date.toLocaleDateString()}
				</Text>
			</TouchableOpacity>

			{showDatePicker && (
				<DateTimePicker
					value={formData.date}
					mode="date"
					display={Platform.OS === 'ios' ? 'spinner' : 'default'}
					onChange={onDateChange}
				/>
			)}

			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<Text style={styles.submitButtonText}>Save Transaction</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	typeContainer: {
		flexDirection: 'row',
		marginBottom: 16,
		gap: 8,
	},
	typeButton: {
		flex: 1,
		padding: 12,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	activeButton: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	buttonText: {
		fontSize: 16,
		color: '#333',
	},
	activeButtonText: {
		color: '#fff',
	},
	dateButton: {
		padding: 12,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		marginBottom: 16,
		backgroundColor: '#fff',
	},
	dateButtonText: {
		fontSize: 16,
		color: '#333',
	},
	submitButton: {
		backgroundColor: '#007AFF',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
