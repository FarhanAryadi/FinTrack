import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Modal,
	PanResponder,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { colors } from '../../constants/colors';
import { categoryService } from '../../services/categoryService';
import { transactionService } from '../../services/transactionService';
import { Category } from '../../types/category';
import { formatCurrency } from '../../utils/formatCurrency';

const { width, height } = Dimensions.get('window');

interface AddTransactionModalProps {
	visible: boolean;
	onClose: () => void;
	transactionType: 'income' | 'expense';
	onSuccess?: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
	visible,
	onClose,
	transactionType,
	onSuccess,
}) => {
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [errors, setErrors] = useState<{
		amount?: string;
		category?: string;
	}>({});

	const slideAnimation = useRef(new Animated.Value(0)).current;
	const carouselRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);

	// Pan responder for slide-to-dismiss
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					// Only allow downward swipe
					slideAnimation.setValue(gestureState.dy / 600); // Normalize value
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 100) {
					// Threshold to dismiss
					Animated.timing(slideAnimation, {
						toValue: 1,
						duration: 200,
						useNativeDriver: true,
					}).start(() => {
						onClose();
					});
				} else {
					Animated.spring(slideAnimation, {
						toValue: 0,
						friction: 8,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	useEffect(() => {
		if (visible) {
			loadCategories();
			slideAnimation.setValue(0);
			Animated.timing(slideAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(slideAnimation, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [visible]);

	const loadCategories = async () => {
		try {
			setLoadingCategories(true);
			const type = transactionType === 'income' ? 'INCOME' : 'EXPENSE';
			const result = await categoryService.getCategories(type);
			setCategories(result);
			if (result.length > 0) {
				setSelectedCategory(result[0]);
			}
		} catch (error) {
			console.error('Error loading categories:', error);
		} finally {
			setLoadingCategories(false);
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const validate = () => {
		const newErrors: typeof errors = {};

		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			newErrors.amount = 'Masukkan jumlah yang valid';
		}

		if (!selectedCategory) {
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
				type: transactionType === 'income' ? 'INCOME' : 'EXPENSE',
				amount: Number(amount),
				description: description.trim(),
				categoryId: selectedCategory!.id.toString(),
				date: date,
			});

			// Reset form
			setAmount('');
			setDescription('');
			setDate(new Date());

			if (onSuccess) {
				onSuccess();
			}

			onClose();
		} catch (error) {
			console.error('Error saving transaction:', error);
		} finally {
			setLoading(false);
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

	const renderCategoryItem = ({
		item,
		index,
	}: {
		item: Category;
		index: number;
	}) => {
		const isActive = index === activeIndex;

		return (
			<TouchableOpacity
				style={[styles.categoryItem, isActive && styles.activeCategoryItem]}
				onPress={() => {
					setSelectedCategory(item);
					if (carouselRef.current) {
						// @ts-ignore
						carouselRef.current.scrollTo({ index });
					}
				}}
			>
				<View
					style={[
						styles.categoryIconContainer,
						transactionType === 'income'
							? styles.incomeCategoryIcon
							: styles.expenseCategoryIcon,
					]}
				>
					<MaterialCommunityIcons
						name={item.icon as any}
						size={28}
						color={
							transactionType === 'income'
								? colors.success.main
								: colors.danger.main
						}
					/>
				</View>
				<Text
					style={[styles.categoryName, isActive && styles.activeCategoryName]}
				>
					{item.name}
				</Text>
			</TouchableOpacity>
		);
	};

	const translateY = slideAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 600],
	});

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<TouchableOpacity
					style={styles.closeArea}
					activeOpacity={1}
					onPress={onClose}
				/>

				<Animated.View
					style={[styles.modalContainer, { transform: [{ translateY }] }]}
				>
					{/* Draggable handle area */}
					<View {...panResponder.panHandlers} style={styles.modalHeader}>
						<View style={styles.headerHandle} />
						<Text style={styles.modalTitle}>
							{transactionType === 'income'
								? 'Tambah Pemasukan'
								: 'Tambah Pengeluaran'}
						</Text>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{/* Category Section */}
						<View style={styles.categorySection}>
							{loadingCategories ? (
								<ActivityIndicator size="large" color={colors.primary.main} />
							) : (
								<>
									<Carousel
										ref={carouselRef}
										loop={false}
										width={width * 0.3}
										height={100}
										data={categories}
										renderItem={renderCategoryItem}
										onSnapToItem={(index) => {
											setActiveIndex(index);
											setSelectedCategory(categories[index]);
										}}
										mode="parallax"
										modeConfig={{
											parallaxScrollingScale: 0.9,
											parallaxScrollingOffset: 50,
										}}
										style={styles.carousel}
									/>
									<Text style={styles.selectedCategoryName}>
										{selectedCategory?.name || 'Pilih Kategori'}
									</Text>
								</>
							)}
						</View>

						{/* Amount Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Amount</Text>
							<View style={styles.amountInputContainer}>
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

						{/* Description */}
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Description (Optional)</Text>
							<TextInput
								style={[styles.input, styles.descriptionInput]}
								placeholder="Add details about this transaction"
								value={description}
								onChangeText={setDescription}
								multiline
								numberOfLines={3}
								textAlignVertical="top"
							/>
						</View>

						{/* Date Picker */}
						<TouchableOpacity
							style={styles.dateContainer}
							onPress={() => setShowDatePicker(true)}
						>
							<Text style={styles.inputLabel}>Date</Text>
							<View style={styles.dateValueContainer}>
								<Text style={styles.dateValue}>
									{date.toLocaleDateString('id-ID', {
										day: '2-digit',
										month: 'long',
										year: 'numeric',
									})}
									{date.toDateString() === new Date().toDateString() &&
										' (Today)'}
								</Text>
								<MaterialCommunityIcons
									name="calendar"
									size={24}
									color="#333"
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

						{/* Submit Button */}
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={[
									styles.submitButton,
									transactionType === 'income'
										? styles.incomeButton
										: styles.expenseButton,
								]}
								onPress={handleSubmit}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator size="small" color="#fff" />
								) : (
									<Text style={styles.submitButtonText}>
										{transactionType === 'income'
											? 'Add Income'
											: 'Add Expense'}
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</ScrollView>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	closeArea: {
		flex: 1,
	},
	modalContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		maxHeight: '85%',
	},
	contentContainer: {
		flex: 1,
	},
	modalHeader: {
		alignItems: 'center',
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	headerHandle: {
		width: 40,
		height: 5,
		backgroundColor: '#e0e0e0',
		borderRadius: 3,
		marginBottom: 10,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	categorySection: {
		marginBottom: 20,
		alignItems: 'center',
		width: '100%',
	},
	carousel: {
		width: width - 40,
		alignSelf: 'center',
	},
	categoryItem: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 5,
		marginHorizontal: 12,
	},
	activeCategoryItem: {
		transform: [{ scale: 1.1 }],
	},
	categoryIconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 6,
		backgroundColor: '#f5f5f5',
	},
	incomeCategoryIcon: {
		backgroundColor: 'rgba(46, 204, 113, 0.1)',
	},
	expenseCategoryIcon: {
		backgroundColor: 'rgba(231, 76, 60, 0.1)',
	},
	categoryName: {
		fontSize: 13,
		color: '#666',
		textAlign: 'center',
		width: 80,
		marginTop: 5,
	},
	activeCategoryName: {
		color: '#333',
		fontWeight: '600',
	},
	selectedCategoryName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginTop: 8,
	},
	inputContainer: {
		marginTop: 20,
	},
	inputLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
		backgroundColor: '#fff',
	},
	descriptionInput: {
		height: 80,
		textAlignVertical: 'top',
		paddingTop: 12,
	},
	amountInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
	},
	currencySymbol: {
		fontSize: 16,
		color: '#333',
		marginRight: 8,
	},
	amountInput: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
	},
	errorText: {
		color: colors.danger.main,
		fontSize: 12,
		marginTop: 4,
	},
	dateContainer: {
		marginTop: 20,
	},
	dateValueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#fff',
	},
	dateValue: {
		fontSize: 16,
		color: '#333',
	},
	buttonContainer: {
		marginTop: 30,
		marginBottom: 20,
	},
	submitButton: {
		backgroundColor: colors.primary.main,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	incomeButton: {
		backgroundColor: colors.success.main,
	},
	expenseButton: {
		backgroundColor: colors.danger.main,
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default AddTransactionModal;
