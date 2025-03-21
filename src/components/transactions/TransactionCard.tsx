import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { Transaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatCurrency';

interface TransactionCardProps {
	transaction: Transaction;
	onPress?: (transaction: Transaction) => void;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Fungsi fallback jika Category tidak tersedia
const getCategoryIcon = (category: string): IconName => {
	const icons: { [key: string]: IconName } = {
		food: 'food',
		transport: 'car',
		shopping: 'shopping-outline',
		entertainment: 'movie-open',
		bills: 'file-document-outline',
		gaji: 'cash-multiple',
		salary: 'cash-multiple',
		investment: 'chart-line',
		other: 'dots-horizontal',
	};
	return icons[category.toLowerCase()] || 'dots-horizontal';
};

const getTypeStyles = (type: 'INCOME' | 'EXPENSE') => {
	return {
		backgroundColor:
			type === 'INCOME' ? colors.success.surface : colors.danger.surface,
		iconColor: type === 'INCOME' ? colors.success.main : colors.danger.main,
		amountColor: type === 'INCOME' ? colors.success.dark : colors.danger.dark,
	};
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
	transaction,
	onPress,
}) => {
	const typeStyles = getTypeStyles(transaction.type);

	// Gunakan ikon dari objek Category jika tersedia, jika tidak gunakan fungsi fallback
	const iconName = transaction.Category?.icon
		? (transaction.Category.icon as IconName)
		: getCategoryIcon(transaction.category);

	return (
		<TouchableOpacity
			onPress={() => onPress?.(transaction)}
			activeOpacity={0.7}
			style={styles.container}
		>
			<View
				style={[styles.card, { backgroundColor: typeStyles.backgroundColor }]}
			>
				<View style={styles.iconContainer}>
					<MaterialCommunityIcons
						name={iconName}
						size={24}
						color={typeStyles.iconColor}
					/>
				</View>
				<View style={styles.detailsContainer}>
					<Text style={styles.category}>
						{transaction.Category?.name || transaction.category}
					</Text>
					<Text style={styles.description}>
						{transaction.description || 'Tidak ada deskripsi'}
					</Text>
					<Text style={styles.date}>
						{format(new Date(transaction.date), 'dd MMM yyyy')}
					</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={[styles.amount, { color: typeStyles.amountColor }]}>
						{transaction.type === 'INCOME' ? '+' : '-'}
						{formatCurrency(Math.abs(transaction.amount))}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20,
		marginVertical: 6,
	},
	card: {
		flexDirection: 'row',
		padding: 16,
		borderRadius: 16,
		alignItems: 'center',
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 15,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		// shadowColor: colors.text.primary,
		// shadowOffset: {
		// 	width: 0,
		// 	height: 2,
		// },
		// shadowOpacity: 0.1,
		// shadowRadius: 3,
		// elevation: 2,
	},
	detailsContainer: {
		flex: 1,
		marginLeft: 16,
	},
	category: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: 4,
	},
	date: {
		fontSize: 12,
		color: colors.text.disabled,
	},
	amountContainer: {
		marginLeft: 16,
	},
	amount: {
		fontSize: 16,
		fontWeight: '600',
	},
});
