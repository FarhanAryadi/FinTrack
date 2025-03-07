import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'success' | 'danger';
	loading?: boolean;
	icon?: IconName;
	style?: ViewStyle;
	textStyle?: TextStyle;
	disabled?: boolean;
}

const getVariantColor = (variant: string) => {
	const colors = {
		primary: '#6366f1',
		secondary: '#64748b',
		success: '#22c55e',
		danger: '#ef4444',
	};
	return colors[variant as keyof typeof colors] || colors.primary;
};

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	loading = false,
	icon,
	style,
	textStyle,
	disabled = false,
}) => {
	const backgroundColor = getVariantColor(variant);

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={loading || disabled}
			activeOpacity={0.8}
			style={[
				styles.button,
				{ backgroundColor },
				disabled && styles.disabled,
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator color="white" />
			) : (
				<View style={styles.content}>
					{icon && (
						<MaterialCommunityIcons
							name={icon}
							size={20}
							color="white"
							style={styles.icon}
						/>
					)}
					<Text style={[styles.text, textStyle]}>{title}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		padding: 12,
		borderRadius: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	icon: {
		marginRight: 8,
	},
	disabled: {
		opacity: 0.6,
	},
});
