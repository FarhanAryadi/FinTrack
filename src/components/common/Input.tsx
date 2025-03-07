import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewStyle,
} from 'react-native';
import { colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	icon?: string;
	containerStyle?: ViewStyle;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export const Input: React.FC<InputProps> = ({
	label,
	error,
	icon,
	containerStyle,
	...props
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View
				style={[
					styles.inputContainer,
					error ? styles.inputError : null,
					props.editable === false ? styles.inputDisabled : null,
				]}
			>
				{icon && (
					<MaterialCommunityIcons
						name={icon as IconName}
						size={20}
						color={error ? colors.danger.main : colors.primary.main}
						style={styles.icon}
					/>
				)}
				<TextInput
					style={styles.input}
					placeholderTextColor={colors.text.disabled}
					{...props}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.text.secondary,
		marginBottom: 8,
		marginLeft: 4,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.card,
		borderWidth: 1.5,
		borderColor: colors.border,
		borderRadius: 12,
		paddingHorizontal: 16,
		height: 52,
		shadowColor: colors.text.primary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: colors.text.primary,
		paddingVertical: 12,
	},
	icon: {
		marginRight: 12,
	},
	inputError: {
		borderColor: colors.danger.main,
		borderWidth: 1.5,
		backgroundColor: colors.danger.surface,
	},
	inputDisabled: {
		backgroundColor: colors.background,
		borderColor: colors.border,
	},
	errorText: {
		color: colors.danger.main,
		fontSize: 12,
		marginTop: 4,
		marginLeft: 4,
	},
});
