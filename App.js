import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FallDetection from './src/screens/FallDetection';
import Entry from './src/screens/Entry';
import Home from './src/screens/Home';
import FallDetected from './src/screens/FallDetected';
import Severity from './src/screens/Severity';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Entry" component={Entry} />
        <Stack.Screen name="Fall" component={FallDetection} />
        <Stack.Screen name="Severity" component={Severity} />
        <Stack.Screen name="FallDetected" component={FallDetected} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
