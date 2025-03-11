import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import { loadFonts } from './src/utils/iconUtils';

// Placeholder screens
const ReportsScreen = () => (
	<View style={{ flex: 1, backgroundColor: '#f5f7fa' }} />
);
const CategoryScreen = () => (
	<View style={{ flex: 1, backgroundColor: '#f5f7fa' }} />
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					display: 'none', // Hide default tab bar since we're using custom one
				},
			}}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Transaction" component={TransactionsScreen} />
			<Tab.Screen name="Reports" component={ReportsScreen} />
			<Tab.Screen name="Category" component={CategoryScreen} />
		</Tab.Navigator>
	);
};

const App = () => {
	useEffect(() => {
		// Load all icon fonts when the app starts
		loadFonts();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Main" component={MainTabs} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
