import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FallDetection from './src/screens/FallDetection';
import Entry from './src/screens/Entry';
import Home from './src/screens/Home';

import { FirebaseProvider } from './src/contexts/FirebaseContext';
import Index from './src/Index';

// const Stack = createNativeStackNavigator();

export default function App() {
  // const { fbDB } = useContext(FirebaseContext);
  return (
    <FirebaseProvider>
      <Index />
    </FirebaseProvider>
  );
}
