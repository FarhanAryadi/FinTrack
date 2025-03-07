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
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
}

const getVariantColor = (variant: string) => {
	const colorMap = {
		primary: colors.primary.main,
		secondary: colors.text.secondary,
		success: colors.success.main,
		danger: colors.danger.main,
	};
	return colorMap[variant as keyof typeof colorMap] || colorMap.primary;
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
				<ActivityIndicator color={colors.text.inverse} />
			) : (
				<View style={styles.content}>
					{icon && (
						<MaterialCommunityIcons
							name={icon}
							size={20}
							color={colors.text.inverse}
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
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: colors.text.inverse,
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
