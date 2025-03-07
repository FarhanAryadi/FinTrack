import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'success' | 'danger';
	loading?: boolean;
	icon?: string;
	style?: ViewStyle;
	textStyle?: TextStyle;
	disabled?: boolean;
}

const getVariantColors = (variant: string) => {
	const colors = {
		primary: ['#4f46e5', '#6366f1'],
		secondary: ['#64748b', '#475569'],
		success: ['#22c55e', '#16a34a'],
		danger: ['#ef4444', '#dc2626'],
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
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={loading || disabled}
			activeOpacity={0.8}
		>
			<Animatable.View animation="fadeIn" duration={300}>
				<LinearGradient
					colors={getVariantColors(variant)}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={[styles.button, disabled && styles.disabled, style]}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<>
							{icon && (
								<Icon name={icon} size={20} color="white" style={styles.icon} />
							)}
							<Text style={[styles.text, textStyle]}>{title}</Text>
						</>
					)}
				</LinearGradient>
			</Animatable.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
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
