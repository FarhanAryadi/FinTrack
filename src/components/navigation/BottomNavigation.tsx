import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { colors } from '../../constants/colors';
import AddTransactionModal from '../modals/AddTransactionModal';

const { width, height } = Dimensions.get('window');

const BottomNavigation = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [animation] = useState(new Animated.Value(0));
	const [showIncomeModal, setShowIncomeModal] = useState(false);
	const [showExpenseModal, setShowExpenseModal] = useState(false);

	const navigateTo = (routeName: string) => {
		navigation.navigate(routeName as never);
	};

	const isActive = (routeName: string) => {
		return route.name === routeName;
	};

	const toggleMenu = () => {
		const toValue = isMenuOpen ? 0 : 1;

		Animated.spring(animation, {
			toValue,
			friction: 6,
			useNativeDriver: true,
		}).start();

		setIsMenuOpen(!isMenuOpen);
	};

	const handleAddTransaction = (type: 'income' | 'expense') => {
		toggleMenu();
		if (type === 'income') {
			setShowIncomeModal(true);
		} else {
			setShowExpenseModal(true);
		}
	};

	// Animasi untuk menu Income dan Expense
	const menuTranslateY = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [100, 0],
	});

	// Animasi untuk rotasi icon plus
	const rotation = animation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '45deg'],
	});

	// Animasi untuk opacity background overlay
	const backdropOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.7],
	});

	const handleTransactionSuccess = () => {
		// Refresh data jika diperlukan
		if (route.name === 'Home' || route.name === 'Transaction') {
			// Trigger refresh
		}
	};

	return (
		<>
			{/* Backdrop overlay */}
			{isMenuOpen && (
				<TouchableWithoutFeedback onPress={toggleMenu}>
					<Animated.View
						style={[styles.backdrop, { opacity: backdropOpacity }]}
					/>
				</TouchableWithoutFeedback>
			)}

			{/* Menu Income dan Expense */}
			<Animated.View
				style={[
					styles.menuContainer,
					{
						transform: [{ translateY: menuTranslateY }],
						opacity: animation,
					},
				]}
			>
				<View style={styles.menuContent}>
					<TouchableOpacity
						style={[styles.menuButton, styles.incomeButton]}
						onPress={() => handleAddTransaction('income')}
					>
						<MaterialCommunityIcons
							name="cash-plus"
							size={24}
							color="#FFFFFF"
						/>
						<Text style={styles.menuButtonText}>Income</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.menuButton, styles.expenseButton]}
						onPress={() => handleAddTransaction('expense')}
					>
						<MaterialCommunityIcons
							name="cash-minus"
							size={24}
							color="#FFFFFF"
						/>
						<Text style={styles.menuButtonText}>Expense</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>

			<View style={styles.container}>
				<View style={styles.navigationBar}>
					<TouchableOpacity
						style={styles.tabItem}
						onPress={() => navigateTo('Home')}
					>
						<View
							style={[
								styles.iconContainer,
								isActive('Home') && styles.activeIcon,
							]}
						>
							<MaterialCommunityIcons
								name="home"
								size={22}
								color={isActive('Home') ? colors.primary.main : '#888'}
							/>
						</View>
						<Text
							style={[styles.tabLabel, isActive('Home') && styles.activeLabel]}
						>
							Home
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.tabItem}
						onPress={() => navigateTo('Transaction')}
					>
						<View
							style={[
								styles.iconContainer,
								isActive('Transaction') && styles.activeIcon,
							]}
						>
							<MaterialCommunityIcons
								name="swap-horizontal"
								size={22}
								color={isActive('Transaction') ? colors.primary.main : '#888'}
							/>
						</View>
						<Text
							style={[
								styles.tabLabel,
								isActive('Transaction') && styles.activeLabel,
							]}
						>
							Transaction
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.addButtonContainer}
						onPress={toggleMenu}
					>
						<Animated.View
							style={[styles.addButton, { transform: [{ rotate: rotation }] }]}
						>
							<MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
						</Animated.View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.tabItem}
						onPress={() => navigateTo('Reports')}
					>
						<View
							style={[
								styles.iconContainer,
								isActive('Reports') && styles.activeIcon,
							]}
						>
							<MaterialCommunityIcons
								name="chart-bar"
								size={22}
								color={isActive('Reports') ? colors.primary.main : '#888'}
							/>
						</View>
						<Text
							style={[
								styles.tabLabel,
								isActive('Reports') && styles.activeLabel,
							]}
						>
							Reports
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.tabItem}
						onPress={() => navigateTo('Category')}
					>
						<View
							style={[
								styles.iconContainer,
								isActive('Category') && styles.activeIcon,
							]}
						>
							<MaterialCommunityIcons
								name="view-grid"
								size={22}
								color={isActive('Category') ? colors.primary.main : '#888'}
							/>
						</View>
						<Text
							style={[
								styles.tabLabel,
								isActive('Category') && styles.activeLabel,
							]}
						>
							Category
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Modal untuk Income */}
			<AddTransactionModal
				visible={showIncomeModal}
				onClose={() => setShowIncomeModal(false)}
				transactionType="income"
				onSuccess={handleTransactionSuccess}
			/>

			{/* Modal untuk Expense */}
			<AddTransactionModal
				visible={showExpenseModal}
				onClose={() => setShowExpenseModal(false)}
				transactionType="expense"
				onSuccess={handleTransactionSuccess}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		width: width,
		backgroundColor: 'transparent',
		alignItems: 'center',
		zIndex: 200,
	},
	navigationBar: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		height: 70,
		alignItems: 'center',
		justifyContent: 'space-around',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		paddingBottom: 10,
		width: width,
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconContainer: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeIcon: {
		backgroundColor: 'rgba(0, 57, 164, 0.1)',
		borderRadius: 20,
		zIndex: 12,
	},
	tabLabel: {
		fontSize: 10,
		color: '#888',
		marginTop: 2,
	},
	activeLabel: {
		color: colors.primary.main,
		fontWeight: '500',
	},
	addButtonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: -30,
		zIndex: 200,
	},
	addButton: {
		backgroundColor: colors.primary.light,
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: colors.primary.light,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#000',
		zIndex: 9,
	},
	menuContainer: {
		position: 'absolute',
		bottom: 90, // Posisi di atas bottom navigation
		width: width,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 11,
	},
	menuContent: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '80%',
	},
	menuButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 50,
		marginHorizontal: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
	incomeButton: {
		backgroundColor: colors.success.main,
	},
	expenseButton: {
		backgroundColor: colors.danger.main,
	},
	menuButtonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
		marginLeft: 8,
	},
});

export default BottomNavigation;
