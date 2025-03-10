import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import HomeScreen from './src/screens/HomeScreen';
import { loadFonts } from './src/utils/iconUtils';

// Placeholder screens
const ProfileScreen = () => (
	<View style={{ flex: 1, backgroundColor: '#f5f7fa' }} />
);
const ChatScreen = () => (
	<View style={{ flex: 1, backgroundColor: '#f5f7fa' }} />
);
const SettingsScreen = () => (
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
			<Tab.Screen name="Profile" component={ProfileScreen} />
			<Tab.Screen name="Chat" component={ChatScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
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
				<Stack.Screen
					name="Add"
					component={AddTransactionScreen}
					options={{
						presentation: 'modal',
						headerShown: true,
						headerTitle: 'Tambah Transaksi',
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
