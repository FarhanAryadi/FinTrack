import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
		backgroundColor: '#4f46e5',
	},
	content: {
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
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
		color: 'white',
		marginTop: 16,
	},
});
