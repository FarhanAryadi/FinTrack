import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'react-native-linear-gradient';

interface HeaderProps {
  title: string;
  subtitle?: string;
  amount?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, amount }) => {
  return (
    <LinearGradient
      colors={['#4f46e5', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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