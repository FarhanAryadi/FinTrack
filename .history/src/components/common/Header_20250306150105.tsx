import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';

interface HeaderProps {
	title: string;
	subtitle?: string;
	amount?: number;
	onCalendarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	amount,
	onCalendarPress,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{title}</Text>
					{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
				</View>
				<TouchableOpacity
					style={styles.calendarButton}
					onPress={onCalendarPress}
				>
					<MaterialCommunityIcons
						name="calendar-month"
						size={24}
						color={colors.text.inverse}
					/>
				</TouchableOpacity>
			</View>
			{amount !== undefined && (
				<View style={styles.amountContainer}>
					<Text style={styles.amountLabel}>Total Balance</Text>
					<Text style={styles.amount}>Rp {formatCurrency(amount)}</Text>
					<View style={styles.indicator} />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 48,
		paddingBottom: 32,
		paddingHorizontal: 20,
		backgroundColor: colors.primary.main,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		shadowColor: colors.primary.dark,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 24,
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: colors.text.inverse,
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.8)',
	},
	calendarButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	amountContainer: {
		alignItems: 'flex-start',
	},
	amountLabel: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.8)',
		marginBottom: 8,
	},
	amount: {
		fontSize: 40,
		fontWeight: '700',
		color: colors.text.inverse,
		marginBottom: 16,
	},
	indicator: {
		width: 32,
		height: 4,
		backgroundColor: colors.accent.green,
		borderRadius: 2,
	},
});
