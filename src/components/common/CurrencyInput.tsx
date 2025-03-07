import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  icon?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  icon,
  ...props
}) => {
  const [formattedValue, setFormattedValue] = useState('');

  // Format nilai saat komponen dimuat atau nilai berubah
  useEffect(() => {
    formatValue(value);
  }, [value]);

  // Format nilai menjadi format Rupiah
  const formatValue = (val: string) => {
    // Hapus semua karakter non-digit
    const numericValue = val.replace(/\D/g, '');
    
    if (numericValue === '') {
      setFormattedValue('');
      return;
    }
    
    // Format angka dengan pemisah ribuan
    const formattedNumber = Number(numericValue).toLocaleString('id-ID');
    setFormattedValue(`Rp ${formattedNumber}`);
  };

  // Handle perubahan input
  const handleChangeText = (text: string) => {
    // Hapus semua karakter non-digit
    const numericValue = text.replace(/\D/g, '');
    
    // Panggil onChangeText dengan nilai numerik
    onChangeText(numericValue);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={colors.text.secondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formattedValue}
          onChangeText={handleChangeText}
          placeholder="Rp 0"
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
  inputError: {
    borderColor: colors.danger.main,
    backgroundColor: colors.danger.surface,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  errorText: {
    color: colors.danger.main,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 