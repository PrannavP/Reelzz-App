import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "react-native";

import { UserProvider } from './src/context/UserContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VideoUploadScreen from './src/screens/VideoUploadScreen';
import { UserContext } from './src/context/UserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for Home and Profile screens
const HomeTabs = () => {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        if (user && user.user && user.user.userImage) {
                            return (
                                <Image
                                    source={{ uri: user.user.userImage }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: focused ? 2 : 0,
                                        borderColor: focused ? '#1e90ff' : 'transparent',
                                    }}
                                />
                            );
                        } else {
                            iconName = focused ? 'person' : 'person-outline';
                            return <Ionicons name={iconName} size={size} color={color} />;
                        }
                    }else if(route.name === "Video Upload"){
                        iconName = focused ? 'add' : 'add-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1e90ff',
                tabBarInactiveTintColor: 'gray',
                headerShown: false, // Hide headers in tab screens
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Video Upload" component={VideoUploadScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Main app component with stack navigation
export default function App() {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator 
                    initialRouteName="Login"
                    screenOptions={{
                        headerShown: false, // Hide headers in stack screens
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="HomeTabs" component={HomeTabs} />
                    <Stack.Screen name='VideoUpload' component={VideoUploadScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
};