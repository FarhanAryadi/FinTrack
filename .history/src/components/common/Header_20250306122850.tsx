import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface HeaderProps {
  title: string;
  subtitle?: string;
  amount?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, amount }) => {
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeIn"
        duration={1000}
        style={styles.content}
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        {amount !== undefined && (
          <Animatable.Text
            animation="fadeInUp"
            delay={500}
            style={styles.amount}
          >
            ${amount.toFixed(2)}
          </Animatable.Text>
        )}
      </Animatable.View>
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