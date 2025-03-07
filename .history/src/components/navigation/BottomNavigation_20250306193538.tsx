import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
	Animated,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const { width } = Dimensions.get('window');

const BottomNavigation = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const animatedValues = {
		home: new Animated.Value(route.name === 'Home' ? 1 : 0),
		profile: new Animated.Value(route.name === 'Profile' ? 1 : 0),
		chat: new Animated.Value(route.name === 'Chat' ? 1 : 0),
		settings: new Animated.Value(route.name === 'Settings' ? 1 : 0),
	};

	const animateIcon = (
		icon: keyof typeof animatedValues,
		routeName: string
	) => {
		// Reset all animations
		Object.keys(animatedValues).forEach((key) => {
			Animated.spring(animatedValues[key as keyof typeof animatedValues], {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		});

		// Animate selected icon
		Animated.spring(animatedValues[icon], {
			toValue: 1,
			friction: 6,
			tension: 40,
			useNativeDriver: true,
		}).start();

		navigation.navigate(routeName as never);
	};

	const getAnimatedStyle = (icon: keyof typeof animatedValues) => {
		return {
			transform: [
				{
					scale: animatedValues[icon].interpolate({
						inputRange: [0, 1],
						outputRange: [1, 1.2],
					}),
				},
			],
			opacity: animatedValues[icon].interpolate({
				inputRange: [0, 1],
				outputRange: [0.5, 1],
			}),
		};
	};

	return (
		<View style={styles.container}>
			<View style={styles.navigationBar}>
				<TouchableOpacity
					style={styles.iconContainer}
					onPress={() => animateIcon('home', 'Home')}
				>
					<Animated.View style={getAnimatedStyle('home')}>
						<MaterialCommunityIcons name="home" size={24} color="#5B37B7" />
					</Animated.View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.iconContainer}
					onPress={() => animateIcon('profile', 'Profile')}
				>
					<Animated.View style={getAnimatedStyle('profile')}>
						<MaterialCommunityIcons name="account" size={24} color="#5B37B7" />
					</Animated.View>
				</TouchableOpacity>

				<View style={styles.addButtonContainer}>
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => navigation.navigate('Add' as never)}
					>
						<MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={styles.iconContainer}
					onPress={() => animateIcon('chat', 'Chat')}
				>
					<Animated.View style={getAnimatedStyle('chat')}>
						<MaterialCommunityIcons name="chat" size={24} color="#5B37B7" />
					</Animated.View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.iconContainer}
					onPress={() => animateIcon('settings', 'Settings')}
				>
					<Animated.View style={getAnimatedStyle('settings')}>
						<MaterialCommunityIcons name="cog" size={24} color="#5B37B7" />
					</Animated.View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		width: width,
		paddingHorizontal: 16,
		paddingBottom: 16,
		backgroundColor: 'transparent',
	},
	navigationBar: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: 30,
		height: 64,
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	iconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 48,
	},
	addButtonContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: -32,
	},
	addButton: {
		backgroundColor: '#5B37B7',
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#5B37B7',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
});

export default BottomNavigation;
