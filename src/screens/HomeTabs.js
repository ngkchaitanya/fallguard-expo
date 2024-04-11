import React, { useContext } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './hometabs/Home';
import Family from './hometabs/Family';
import Profile from './hometabs/Profile';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ navigation }) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Family" component={Family}
                options={{
                    tabBarLabel: 'Family',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    );
}
