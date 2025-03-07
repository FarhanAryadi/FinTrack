import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
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
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState<Category>();
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0);
	const [loadingBalance, setLoadingBalance] = useState(true);
	const [errors, setErrors] = useState<{
		amount?: string;
		category?: string;
		description?: string;
	}>({});

	useEffect(() => {
		fetchBalance();
	}, []);

	const fetchBalance = async () => {
		try {
			setLoadingBalance(true);
			const data = await transactionService.getTransactions();

			// Calculate balance
			let totalIncome = 0;
			let totalExpense = 0;

			data.forEach((transaction: any) => {
				if (transaction.type === 'INCOME') {
					totalIncome += transaction.amount;
				} else {
					totalExpense += transaction.amount;
				}
			});

			setBalance(totalIncome - totalExpense);
		} catch (error) {
			console.error('Error fetching balance:', error);
		} finally {
			setLoadingBalance(false);
		}
	};

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
				description: description.trim(),
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
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" backgroundColor="#5352ed" />

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{/* Balance */}
					<View style={styles.balanceSection}>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => navigation.goBack()}
						>
							<MaterialCommunityIcons name="close" size={24} color="#fff" />
						</TouchableOpacity>

						<View style={styles.balanceContainer}>
							{loadingBalance ? (
								<ActivityIndicator size="small" color="#fff" />
							) : (
								<>
									<Text style={styles.balanceAmount}>
										{formatCurrency(balance)}
									</Text>
									<Text style={styles.balanceLabel}>Total Saldo</Text>
								</>
							)}
						</View>

						<TouchableOpacity
							style={styles.saveButton}
							onPress={handleSubmit}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator size="small" color="#fff" />
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
								type === 'EXPENSE'
									? styles.expenseButton
									: styles.inactiveButton,
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
									type === 'EXPENSE'
										? styles.activeTypeText
										: styles.inactiveTypeText,
								]}
							>
								Pengeluaran
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.typeButton,
								type === 'INCOME' ? styles.incomeButton : styles.inactiveButton,
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
									type === 'INCOME'
										? styles.activeTypeText
										: styles.inactiveTypeText,
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

					{/* Description Input */}
					<TouchableOpacity
						style={styles.descriptionContainer}
						onPress={() => {
							// Focus on description input
						}}
					>
						<TextInput
							style={styles.descriptionInput}
							placeholder="Tambahkan catatan..."
							placeholderTextColor="#999"
							value={description}
							onChangeText={setDescription}
							multiline
						/>
						<MaterialCommunityIcons
							name="chevron-down"
							size={24}
							color="#999"
						/>
					</TouchableOpacity>

					{/* Amount Display */}
					<View style={styles.amountContainer}>
						<Text style={styles.expenseLabel}>
							{type === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
						</Text>
						<View style={styles.amountInputContainer}>
							<Text style={styles.currencySymbol}>Rp</Text>
							<Text style={styles.amountInput}>{displayAmount}</Text>
						</View>
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
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#5352ed',
	},
	header: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#5352ed',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
	},
	container: {
		flex: 1,
		backgroundColor: '#333',
	},
	scrollContent: {
		flexGrow: 1,
	},
	balanceSection: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 20,
		backgroundColor: '#333',
	},
	closeButton: {
		padding: 8,
	},
	balanceContainer: {
		alignItems: 'center',
		height: 50,
		justifyContent: 'center',
	},
	balanceAmount: {
		fontSize: 24,
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
		paddingVertical: ,
		justifyContent: 'space-between',
		backgroundColor: '#333',
	},
	typeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 30,
		flex: 0.48,
		justifyContent: 'center',
	},
	expenseButton: {
		backgroundColor: '#ff6b6b',
	},
	incomeButton: {
		backgroundColor: '#1dd1a1',
	},
	inactiveButton: {
		backgroundColor: '#f1f2f6',
	},
	typeText: {
		fontSize: 16,
		marginLeft: 8,
		fontWeight: '500',
	},
	activeTypeText: {
		color: '#fff',
	},
	inactiveTypeText: {
		color: '#333',
	},
	categoryContainer: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: '#333',
	},
	descriptionContainer: {
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	descriptionInput: {
		flex: 1,
		fontSize: 16,
		color: '#333',
		paddingVertical: 4,
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
	keypadContainer: {
		backgroundColor: '#fff',
		paddingHorizontal: 24,
		paddingBottom: 32,
		paddingTop: 8,
	},
	keypadRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	keypadButton: {
		width: (width - 96) / 3,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		backgroundColor: '#f5f5f5',
	},
	keypadButtonText: {
		fontSize: 24,
		fontWeight: '500',
		color: '#333',
	},
});

export default AddTransactionScreen;
