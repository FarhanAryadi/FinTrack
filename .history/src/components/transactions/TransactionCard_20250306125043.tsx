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
		salary: 'cash-plus',
		investment: 'chart-line',
		other: 'dots-horizontal',
	};
	return icons[category.toLowerCase()] || 'dots-horizontal';
};

const getTypeColor = (type: 'INCOME' | 'EXPENSE') => {
	return type === 'INCOME'
		? colors.transaction.income.main
		: colors.transaction.expense.main;
};

const getIconBackgroundColor = (type: 'INCOME' | 'EXPENSE') => {
	return type === 'INCOME'
		? colors.transaction.income.dark
		: colors.transaction.expense.dark;
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
	transaction,
	onPress,
}) => {
	return (
		<View>
			<TouchableOpacity
				onPress={() => onPress?.(transaction)}
				activeOpacity={0.7}
			>
				<View
					style={[
						styles.container,
						{ backgroundColor: getTypeColor(transaction.type) },
					]}
				>
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: getIconBackgroundColor(transaction.type) },
						]}
					>
						<MaterialCommunityIcons
							name={getCategoryIcon(transaction.category)}
							size={24}
							color={colors.text.inverse}
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
						<Text style={styles.amount}>
							{transaction.type === 'INCOME' ? '+' : '-'}$
							{Math.abs(transaction.amount).toFixed(2)}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 16,
		marginHorizontal: 16,
		marginVertical: 8,
		borderRadius: 12,
		elevation: 3,
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	detailsContainer: {
		flex: 1,
		marginLeft: 12,
	},
	category: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.text.inverse,
	},
	description: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.8)',
		marginTop: 4,
	},
	date: {
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.7)',
		marginTop: 4,
	},
	amountContainer: {
		justifyContent: 'center',
	},
	amount: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.text.inverse,
	},
});
