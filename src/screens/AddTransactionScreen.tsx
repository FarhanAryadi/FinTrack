import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
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
	route: RouteProp<RootStackParamList, 'Add'>;
};

const AddTransactionScreen = ({
	navigation,
	route,
}: AddTransactionScreenProps) => {
	const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState<Category>();
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0);
	const [loadingBalance, setLoadingBalance] = useState(true);
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [errors, setErrors] = useState<{
		amount?: string;
		category?: string;
		description?: string;
	}>({});

	useEffect(() => {
		fetchBalance();

		// Set transaction type based on navigation parameter
		if (route.params?.transactionType) {
			setType(route.params.transactionType === 'income' ? 'INCOME' : 'EXPENSE');
		}
	}, [route.params]);

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

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	// Format number with thousand separator
	const formatNumber = (value: string): string => {
		// Remove non-digit characters
		const numericValue = value.replace(/\D/g, '');

		// Format with thousand separator
		if (numericValue === '') return '';

		return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
	};

	// Handle amount input change
	const handleAmountChange = (value: string) => {
		// Remove non-digit characters before storing
		const numericValue = value.replace(/\D/g, '');
		setAmount(numericValue);
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

					{/* Amount Input */}
					<View style={styles.amountContainer}>
						<Text style={styles.amountLabel}>
							{type === 'EXPENSE' ? 'Jumlah Pengeluaran' : 'Jumlah Pemasukan'}
						</Text>
						<View style={styles.amountInputWrapper}>
							<Text style={styles.currencySymbol}>Rp</Text>
							<TextInput
								style={styles.amountInput}
								keyboardType="numeric"
								placeholder="0"
								placeholderTextColor="#ccc"
								value={formatNumber(amount)}
								onChangeText={handleAmountChange}
							/>
						</View>
						{errors.amount && (
							<Text style={styles.errorText}>{errors.amount}</Text>
						)}
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

					{/* Date Picker */}
					<TouchableOpacity
						style={styles.optionContainer}
						onPress={() => setShowDatePicker(true)}
					>
						<View style={styles.optionLeft}>
							<MaterialCommunityIcons name="calendar" size={24} color="#333" />
							<Text style={styles.optionText}>Tanggal</Text>
						</View>
						<View style={styles.optionRight}>
							<Text style={styles.optionValue}>
								{format(date, 'dd MMMM yyyy', { locale: id })}
							</Text>
							<MaterialCommunityIcons
								name="chevron-right"
								size={24}
								color="#999"
							/>
						</View>
						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display="default"
								onChange={handleDateChange}
							/>
						)}
					</TouchableOpacity>

					{/* Description Input */}
					<View style={styles.descriptionContainer}>
						<Text style={styles.descriptionLabel}>Catatan</Text>
						<TextInput
							style={styles.descriptionInput}
							placeholder="Tambahkan catatan transaksi..."
							placeholderTextColor="#999"
							value={description}
							onChangeText={setDescription}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>

					{/* Submit Button */}
					<TouchableOpacity
						style={styles.submitButton}
						onPress={handleSubmit}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#fff" />
						) : (
							<>
								<MaterialCommunityIcons name="check" size={24} color="#fff" />
								<Text style={styles.submitButtonText}>Simpan Transaksi</Text>
							</>
						)}
					</TouchableOpacity>
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
		paddingBottom: 24,
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
		paddingVertical: 16,
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
	amountContainer: {
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
	},
	amountLabel: {
		fontSize: 14,
		color: '#999',
		marginBottom: 8,
	},
	amountInputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	currencySymbol: {
		fontSize: 20,
		color: '#333',
		marginRight: 4,
	},
	amountInput: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		flex: 1,
	},
	errorText: {
		color: '#ff6b6b',
		fontSize: 12,
		marginTop: 4,
	},
	categoryContainer: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: '#333',
	},
	optionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	optionLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionText: {
		fontSize: 16,
		color: '#333',
		marginLeft: 12,
	},
	optionRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionValue: {
		fontSize: 14,
		color: '#666',
		marginRight: 8,
	},
	descriptionContainer: {
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
	},
	descriptionLabel: {
		fontSize: 14,
		color: '#999',
		marginBottom: 8,
	},
	descriptionInput: {
		fontSize: 16,
		color: '#333',
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 8,
		padding: 12,
		minHeight: 100,
	},
	submitButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primary.main,
		marginHorizontal: 16,
		marginTop: 8,
		paddingVertical: 16,
		borderRadius: 12,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
		marginLeft: 8,
	},
});

export default AddTransactionScreen;
