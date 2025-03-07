import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
	Dimensions,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { CategoryDropdown } from '../components/common/CategoryDropdown';
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { Category } from '../types/category';
import { RootStackParamList } from '../types/navigation';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

type AddTransactionScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Add'>;
};

const AddTransactionScreen = ({ navigation }: AddTransactionScreenProps) => {
	const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [amount, setAmount] = useState('');
	const [displayAmount, setDisplayAmount] = useState('0');
	const [comment, setComment] = useState('');
	const [category, setCategory] = useState<Category>();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{
		amount?: string;
		category?: string;
		description?: string;
	}>({});

	const handleNumberPress = (num: string) => {
		if (amount === '0' && num === '0') return;

		let newAmount = amount;
		if (amount === '0') {
			newAmount = num;
		} else {
			newAmount = amount + num;
		}

		setAmount(newAmount);
		setDisplayAmount(newAmount);
	};

	const handleBackspace = () => {
		if (amount.length <= 1) {
			setAmount('0');
			setDisplayAmount('0');
		} else {
			const newAmount = amount.slice(0, -1);
			setAmount(newAmount);
			setDisplayAmount(newAmount);
		}
	};

	const validate = () => {
		const newErrors: typeof errors = {};

		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			newErrors.amount = 'Masukkan jumlah yang valid';
		}

		if (!category) {
			newErrors.category = 'Pilih kategori';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setLoading(true);
		try {
			await transactionService.createTransaction({
				type,
				amount: Number(amount),
				description: comment,
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
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#333" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.closeButton}
					onPress={() => navigation.goBack()}
				>
					<MaterialCommunityIcons name="close" size={24} color="#fff" />
				</TouchableOpacity>

				<View style={styles.balanceContainer}>
					<Text style={styles.balanceAmount}>{formatCurrency(32500000)}</Text>
					<Text style={styles.balanceLabel}>Total Saldo</Text>
				</View>

				<TouchableOpacity
					style={styles.saveButton}
					onPress={handleSubmit}
					disabled={loading}
				>
					{loading ? (
						<MaterialCommunityIcons name="loading" size={24} color="#fff" />
					) : (
						<MaterialCommunityIcons name="check" size={24} color="#fff" />
					)}
				</TouchableOpacity>
			</View>

			{/* Type Selector */}
			<View style={styles.typeContainer}>
				<TouchableOpacity
					style={[
						styles.typeButton,
						type === 'EXPENSE' && styles.activeTypeButton,
					]}
					onPress={() => setType('EXPENSE')}
				>
					<MaterialCommunityIcons
						name="arrow-down"
						size={20}
						color={type === 'EXPENSE' ? '#fff' : '#333'}
					/>
					<Text
						style={[
							styles.typeText,
							type === 'EXPENSE' && styles.activeTypeText,
						]}
					>
						Pengeluaran
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.typeButton,
						type === 'INCOME' && styles.activeTypeButtonIncome,
					]}
					onPress={() => setType('INCOME')}
				>
					<MaterialCommunityIcons
						name="arrow-up"
						size={20}
						color={type === 'INCOME' ? '#fff' : '#333'}
					/>
					<Text
						style={[
							styles.typeText,
							type === 'INCOME' && styles.activeTypeText,
						]}
					>
						Pemasukan
					</Text>
				</TouchableOpacity>
			</View>

			{/* Category Selector */}
			<View style={styles.categoryContainer}>
				<CategoryDropdown
					value={category}
					onChange={setCategory}
					type={type}
					error={errors.category}
				/>
			</View>

			{/* Amount Input */}
			<View style={styles.amountContainer}>
				<Text style={styles.expenseLabel}>
					{type === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
				</Text>
				<View style={styles.amountInputContainer}>
					<Text style={styles.currencySymbol}>Rp</Text>
					<Text style={styles.amountInput}>{displayAmount}</Text>
				</View>

				<TextInput
					style={styles.commentInput}
					placeholder="Tambahkan komentar..."
					placeholderTextColor="#999"
					value={comment}
					onChangeText={setComment}
				/>
			</View>

			{/* Keypad */}
			<View style={styles.keypadContainer}>
				<View style={styles.keypadRow}>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('1')}
					>
						<Text style={styles.keypadButtonText}>1</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('2')}
					>
						<Text style={styles.keypadButtonText}>2</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('3')}
					>
						<Text style={styles.keypadButtonText}>3</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.keypadRow}>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('4')}
					>
						<Text style={styles.keypadButtonText}>4</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('5')}
					>
						<Text style={styles.keypadButtonText}>5</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('6')}
					>
						<Text style={styles.keypadButtonText}>6</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.keypadRow}>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('7')}
					>
						<Text style={styles.keypadButtonText}>7</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('8')}
					>
						<Text style={styles.keypadButtonText}>8</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('9')}
					>
						<Text style={styles.keypadButtonText}>9</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.keypadRow}>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('0')}
					>
						<Text style={styles.keypadButtonText}>0</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={() => handleNumberPress('.')}
					>
						<Text style={styles.keypadButtonText}>.</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.keypadButton}
						onPress={handleBackspace}
					>
						<MaterialCommunityIcons
							name="backspace-outline"
							size={24}
							color="#333"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#333',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 16,
	},
	closeButton: {
		padding: 8,
	},
	balanceContainer: {
		alignItems: 'center',
	},
	balanceAmount: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
	},
	balanceLabel: {
		fontSize: 14,
		color: '#ccc',
	},
	saveButton: {
		padding: 8,
	},
	typeContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 8,
		justifyContent: 'space-between',
	},
	typeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 24,
		flex: 0.48,
		justifyContent: 'center',
	},
	activeTypeButton: {
		backgroundColor: colors.danger.main,
	},
	activeTypeButtonIncome: {
		backgroundColor: colors.success.main,
	},
	typeText: {
		fontSize: 14,
		color: '#333',
		marginLeft: 8,
	},
	activeTypeText: {
		color: '#fff',
		fontWeight: '500',
	},
	categoryContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	amountContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		flex: 1,
	},
	expenseLabel: {
		fontSize: 16,
		color: '#999',
		textAlign: 'center',
		marginBottom: 16,
	},
	amountInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 24,
	},
	currencySymbol: {
		fontSize: 24,
		color: '#999',
		marginRight: 4,
	},
	amountInput: {
		fontSize: 48,
		fontWeight: 'bold',
		color: '#333',
	},
	commentInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		paddingVertical: 8,
		fontSize: 16,
		color: '#333',
	},
	keypadContainer: {
		backgroundColor: '#fff',
		paddingHorizontal: 24,
		paddingBottom: 24,
	},
	keypadRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	keypadButton: {
		width: (width - 96) / 3,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 32,
		backgroundColor: '#f5f5f5',
	},
	keypadButtonText: {
		fontSize: 24,
		fontWeight: '500',
		color: '#333',
	},
});

export default AddTransactionScreen;
