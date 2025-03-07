import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { Transaction } from '../../types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    food: 'food',
    transport: 'car',
    shopping: 'shopping',
    entertainment: 'movie',
    bills: 'file-document',
    salary: 'cash-plus',
    investment: 'chart-line',
    other: 'dots-horizontal',
  };
  return icons[category.toLowerCase()] || 'dots-horizontal';
};

const getTypeColors = (type: 'INCOME' | 'EXPENSE') => {
  return type === 'INCOME' 
    ? ['#22c55e', '#16a34a']
    : ['#ef4444', '#dc2626'];
};

export const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  onPress 
}) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      useNativeDriver
    >
      <TouchableOpacity
        onPress={() => onPress?.(transaction)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={getTypeColors(transaction.type)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <View style={styles.iconContainer}>
            <Icon
              name={getCategoryIcon(transaction.category)}
              size={24}
              color="white"
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.category}>{transaction.category}</Text>
            <Text style={styles.description}>
              {transaction.description || 'No description'}
            </Text>
            <Text style={styles.date}>
              {format(transaction.date, 'dd MMM yyyy')}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {transaction.type === 'INCOME' ? '+' : '-'}
              ${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  amountContainer: {
    justifyContent: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
}); 