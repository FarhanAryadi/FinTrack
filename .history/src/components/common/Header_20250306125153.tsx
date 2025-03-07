import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

interface HeaderProps {
	title: string;
	subtitle?: string;
	amount?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, amount }) => {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>{title}</Text>
				{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
				{amount !== undefined && (
					<Text style={styles.amount}>${amount.toFixed(2)}</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 32,
		paddingHorizontal: 16,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		backgroundColor: colors.primary.main,
		shadowColor: colors.primary.dark,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	content: {
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.text.inverse,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.8)',
		marginTop: 8,
		textAlign: 'center',
	},
	amount: {
		fontSize: 36,
		fontWeight: 'bold',
		color: colors.text.inverse,
		marginTop: 16,
	},
});
