import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';

interface CategoryDropdownProps {
	value?: Category;
	onChange: (category: Category) => void;
	type: 'INCOME' | 'EXPENSE';
	error?: string;
	label?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
	value,
	onChange,
	type,
	error,
	label,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadCategories();
	}, [type]);

	const loadCategories = async () => {
		try {
			setLoading(true);
			const result = await categoryService.getCategories(type);
			setCategories(result);
		} catch (error) {
			console.error('Error loading categories:', error);
		} finally {
			setLoading(false);
		}
	};

	const renderItem = ({ item }: { item: Category }) => (
		<TouchableOpacity
			style={styles.item}
			onPress={() => {
				onChange(item);
				setIsOpen(false);
			}}
		>
			<View style={styles.itemIconContainer}>
				<MaterialCommunityIcons
					name={item.icon as any}
					size={24}
					color={type === 'INCOME' ? colors.success.main : colors.danger.main}
				/>
			</View>
			<Text style={styles.itemText}>{item.name}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TouchableOpacity
				style={[styles.button, error ? styles.buttonError : null]}
				onPress={() => setIsOpen(true)}
			>
				{value ? (
					<View style={styles.selectedValue}>
						<View
							style={[
								styles.iconContainer,
								type === 'INCOME'
									? styles.incomeIconContainer
									: styles.expenseIconContainer,
							]}
						>
							<MaterialCommunityIcons
								name={value.icon as any}
								size={24}
								color={
									type === 'INCOME' ? colors.success.main : colors.danger.main
								}
							/>
						</View>
						<Text style={styles.selectedText}>{value.name}</Text>
					</View>
				) : (
					<Text style={styles.placeholder}>Pilih Kategori</Text>
				)}
				<MaterialCommunityIcons
					name="chevron-down"
					size={24}
					color={colors.text.secondary}
				/>
			</TouchableOpacity>
			{error && <Text style={styles.errorText}>{error}</Text>}

			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsOpen(false)}
			>
				<TouchableOpacity
					style={styles.modalOverlay}
					activeOpacity={1}
					onPress={() => setIsOpen(false)}
				>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Pilih Kategori</Text>
							<TouchableOpacity onPress={() => setIsOpen(false)}>
								<MaterialCommunityIcons
									name="close"
									size={24}
									color={colors.text.secondary}
								/>
							</TouchableOpacity>
						</View>
						{loading ? (
							<ActivityIndicator size="large" color={colors.primary.main} />
						) : (
							<FlatList
								data={categories}
								renderItem={renderItem}
								keyExtractor={(item) => item.id.toString()}
								showsVerticalScrollIndicator={false}
								contentContainerStyle={styles.listContent}
							/>
						)}
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.text.secondary,
		marginBottom: 8,
		marginLeft: 4,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 12,
		paddingHorizontal: 16,
		height: 52,
	},
	buttonError: {
		borderColor: colors.danger.main,
		backgroundColor: colors.danger.surface,
	},
	selectedValue: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	incomeIconContainer: {
		backgroundColor: colors.success.surface,
	},
	expenseIconContainer: {
		backgroundColor: colors.danger.surface,
	},
	selectedText: {
		fontSize: 16,
		color: colors.text.primary,
		flex: 1,
	},
	placeholder: {
		fontSize: 16,
		color: colors.text.disabled,
		flex: 1,
	},
	errorText: {
		color: colors.danger.main,
		fontSize: 12,
		marginTop: 4,
		marginLeft: 4,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: colors.card,
		borderRadius: 20,
		width: '90%',
		maxHeight: '80%',
		padding: 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary,
	},
	listContent: {
		paddingVertical: 8,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 12,
		marginBottom: 8,
	},
	itemIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	itemText: {
		fontSize: 16,
		color: colors.text.primary,
	},
});
