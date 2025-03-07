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
import { colors } from '../../constants/colors';

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
	size?: 'small' | 'medium' | 'large';
}

const getVariantStyles = (variant: string) => {
	const variants = {
		primary: {
			backgroundColor: colors.primary.main,
			pressedColor: colors.primary.dark,
			textColor: colors.text.inverse,
		},
		secondary: {
			backgroundColor: colors.background,
			pressedColor: colors.border,
			textColor: colors.text.primary,
		},
		success: {
			backgroundColor: colors.success.main,
			pressedColor: colors.success.dark,
			textColor: colors.text.inverse,
		},
		danger: {
			backgroundColor: colors.danger.main,
			pressedColor: colors.danger.dark,
			textColor: colors.text.inverse,
		},
	};
	return variants[variant as keyof typeof variants] || variants.primary;
};

const getSizeStyles = (size: string = 'medium') => {
	const sizes = {
		small: {
			height: 36,
			fontSize: 14,
			iconSize: 16,
			paddingHorizontal: 16,
		},
		medium: {
			height: 44,
			fontSize: 16,
			iconSize: 20,
			paddingHorizontal: 20,
		},
		large: {
			height: 52,
			fontSize: 18,
			iconSize: 24,
			paddingHorizontal: 24,
		},
	};
	return sizes[size as keyof typeof sizes] || sizes.medium;
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
	size = 'medium',
}) => {
	const variantStyles = getVariantStyles(variant);
	const sizeStyles = getSizeStyles(size);

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={loading || disabled}
			activeOpacity={0.8}
			style={[
				styles.button,
				{
					backgroundColor: variantStyles.backgroundColor,
					height: sizeStyles.height,
					paddingHorizontal: sizeStyles.paddingHorizontal,
				},
				disabled && styles.disabled,
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator color={variantStyles.textColor} />
			) : (
				<View style={styles.content}>
					{icon && (
						<MaterialCommunityIcons
							name={icon}
							size={sizeStyles.iconSize}
							color={variantStyles.textColor}
							style={styles.icon}
						/>
					)}
					<Text
						style={[
							styles.text,
							{
								color: variantStyles.textColor,
								fontSize: sizeStyles.fontSize,
							},
							textStyle,
						]}
					>
						{title}
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontWeight: '600',
		textAlign: 'center',
	},
	icon: {
		marginRight: 8,
	},
	disabled: {
		opacity: 0.5,
	},
});
