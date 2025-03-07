import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import HomeScreen from './src/screens/';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Tab = createBottomTabNavigator();

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="light" />
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'Home') {
							iconName = focused ? 'home' : 'home-outline';
						} else if (route.name === 'Add') {
							iconName = focused ? 'plus-circle' : 'plus-circle-outline';
						} else if (route.name === 'Statistics') {
							iconName = focused ? 'chart-bar' : 'chart-bar-outline';
						}

						return (
							<AnimatedIcon
								name={iconName || 'home'}
								size={size}
								color={color}
								animation={focused ? 'bounceIn' : undefined}
								duration={1000}
							/>
						);
					},
					tabBarActiveTintColor: '#6366f1',
					tabBarInactiveTintColor: '#9ca3af',
					tabBarStyle: {
						backgroundColor: 'white',
						borderTopWidth: 0,
						elevation: 10,
						shadowColor: '#000',
						shadowOffset: {
							width: 0,
							height: -2,
						},
						shadowOpacity: 0.1,
						shadowRadius: 3.84,
						height: 60,
						paddingBottom: 8,
					},
					headerStyle: {
						backgroundColor: '#4f46e5',
						elevation: 0,
						shadowOpacity: 0,
					},
					headerTintColor: 'white',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				})}
			>
				<Tab.Screen
					name="Home"
					component={HomeScreen}
					options={{
						title: 'Finance Tracker',
					}}
				/>
				<Tab.Screen
					name="Add"
					component={AddTransactionScreen}
					options={{
						title: 'Add Transaction',
					}}
				/>
				<Tab.Screen
					name="Statistics"
					component={StatisticsScreen}
					options={{
						title: 'Statistics',
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}
