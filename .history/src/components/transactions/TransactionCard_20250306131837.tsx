import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { Transaction } from '../../types/transaction';

interface TransactionCardProps {
	transaction: Transaction;
	onPress?: (transaction: Transaction) => void;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const getCategoryIcon = (category: string): IconName => {
	const icons: { [key: string]: IconName } = {
		food: 'food',
		transport: 'car',
		shopping: 'shopping',
		entertainment: 'movie',
		bills: 'file-document',
		gaji: 'cash-multiple',
		investment: 'chart-line',
		service motor: ''
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
						name={getCategoryIcon(transaction.category)}
						size={24}
						color={typeStyles.iconColor}
					/>
				</View>
				<View style={styles.detailsContainer}>
					<Text style={styles.category}>{transaction.category}</Text>
					<Text style={styles.description}>
						{transaction.description || 'No description'}
					</Text>
					<Text style={styles.date}>
						{format(transaction.date, 'dd MMM yyyy')}
					</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={[styles.amount, { color: typeStyles.amountColor }]}>
						{transaction.type === 'INCOME' ? '+' : '-'}$
						{Math.abs(transaction.amount).toFixed(2)}
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
