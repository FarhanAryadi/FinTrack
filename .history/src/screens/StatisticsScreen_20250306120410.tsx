import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Header } from '../components/common/Header';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/transaction';

const StatisticsScreen: React.FC = () => {
  const { transactions } = useTransactions();
  const [expensesByCategory, setExpensesByCategory] = useState<{ name: string; amount: number; color: string }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    calculateStatistics();
  }, [transactions]);

  const calculateStatistics = () => {
    // Calculate expenses by category
    const categoryMap = new Map<string, number>();
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, amount], index) => ({
        name,
        amount,
        color: colors[index % colors.length],
      }));

    setExpensesByCategory(categoryData);

    // Calculate monthly totals
    const monthlyTotals = new Map<string, number>();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      const amount = t.type === 'INCOME' ? t.amount : -t.amount;
      const current = monthlyTotals.get(month) || 0;
      monthlyTotals.set(month, current + amount);
    });

    const monthlyChartData = {
      labels: last6Months,
      datasets: [{
        data: last6Months.map(month => monthlyTotals.get(month) || 0),
      }],
    };

    setMonthlyData(monthlyChartData);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <Header
        title="Statistics"
        subtitle="Financial Overview"
      />
      <View style={styles.chartsContainer}>
        <View style={styles.chartCard}>
          <LineChart
            data={monthlyData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <PieChart
            data={expensesByCategory}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  chartsContainer: {
    padding: 16,
    gap: 16,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StatisticsScreen; 