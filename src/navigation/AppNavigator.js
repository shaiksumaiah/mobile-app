import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import VideoListScreen from '../screens/VideoListScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import GamesListScreen from '../screens/GamesListScreen';
import GamePlayerScreen from '../screens/GamePlayerScreen';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const PlaceholderScreen = ({ navigation, name }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{name} Placeholder</Text>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
        >
            <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1F2937',
    },
    button: {
        padding: 12,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#3B82F6',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'E-Learning App' }} />
                <Stack.Screen name="VideoList" component={VideoListScreen} options={{ title: 'Select Topic' }} />
                <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GamesList" component={GamesListScreen} options={{ title: 'Offline Games' }} />
                <Stack.Screen name="GamePlayer" component={GamePlayerScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
