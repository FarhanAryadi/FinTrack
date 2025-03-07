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
import { colors } from '../constants/colors';
import { transactionService } from '../services/transactionService';
import { RootStackParamList } from '../types/navigation';
import { formatCurrency } from '../utils/formatCurrency';

const { width } = Dimensions.get('window');

type AddTransactionScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Add'>;
};

export const AddTransactionScreen = ({
	navigation,
}: AddTransactionScreenProps) => {
	const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [amount, setAmount] = useState('');
	const [displayAmount, setDisplayAmount] = useState('0');
	const [comment, setComment] = useState('');
	const [selectedCategory, setSelectedCategory] = useState({
		id: '1',
		name: 'Shopping',
		icon: 'shopping-outline',
		type: 'EXPENSE',
	});
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
		id: '1',
		name: 'Cash',
		icon: 'cash',
	});
	const [loading, setLoading] = useState(false);

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

	const handleSubmit = async () => {
		if (Number(amount) <= 0) return;

		setLoading(true);
		try {
			await transactionService.createTransaction({
				type,
				amount: Number(amount),
				description: comment,
				categoryId: selectedCategory.id,
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

				<TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
					<MaterialCommunityIcons name="check" size={24} color="#fff" />
				</TouchableOpacity>
			</View>

			{/* Category Selector */}
			<View style={styles.categoryContainer}>
				<TouchableOpacity style={styles.categoryButton}>
					<View style={styles.categoryIcon}>
						<MaterialCommunityIcons
							name={selectedPaymentMethod.icon as any}
							size={24}
							color="#333"
						/>
					</View>
					<Text style={styles.categoryText}>{selectedPaymentMethod.name}</Text>
					<MaterialCommunityIcons name="chevron-down" size={20} color="#333" />
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.categoryButton, styles.categoryButtonGreen]}
				>
					<View style={[styles.categoryIcon, styles.categoryIconGreen]}>
						<MaterialCommunityIcons
							name={selectedCategory.icon as any}
							size={24}
							color="#333"
						/>
					</View>
					<Text style={styles.categoryText}>{selectedCategory.name}</Text>
					<MaterialCommunityIcons name="chevron-down" size={20} color="#333" />
				</TouchableOpacity>
			</View>

			{/* Amount Input */}
			<View style={styles.amountContainer}>
				<Text style={styles.expenseLabel}>Pengeluaran</Text>
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
	categoryContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 16,
		justifyContent: 'space-between',
	},
	categoryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e8f0fe',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 24,
		flex: 0.48,
	},
	categoryButtonGreen: {
		backgroundColor: '#e6f7e9',
	},
	categoryIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#d0e1fd',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
	categoryIconGreen: {
		backgroundColor: '#c8ebd0',
	},
	categoryText: {
		fontSize: 14,
		color: '#333',
		flex: 1,
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
