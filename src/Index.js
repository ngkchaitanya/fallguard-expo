import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import FallDetection from './src/screens/FallDetection';
// import Entry from './src/screens/Entry';
// import Home from './src/screens/Home';

// import { FirebaseContext } from './src/contexts/FirebaseContext';
// import Home from './screens/HomeTabs';
import FallDetection from './screens/FallDetection';
import Tracking from './screens/Tracking';
import { FirebaseContext } from './contexts/FirebaseContext';
import { Text, View } from 'react-native';
import AppLoading from './screens/AppLoading';
import { AuthContext } from './contexts/AuthContext';
import Entry from './screens/onboarding/Entry';
import SignUp from './screens/onboarding/SignUp';
import Login from './screens/onboarding/Login';
import HomeTabs from './screens/HomeTabs';
import { FallContext } from './contexts/FallContext';
import Severity from './screens/fall/Severity';

const Stack = createNativeStackNavigator();

export default function Index() {
    const { fbDB } = useContext(FirebaseContext);
    const { user } = useContext(AuthContext);
    const { fallDetected } = useContext(FallContext);
    console.log("in index");

    return (
        <>
            {fbDB ? (
                <NavigationContainer>
                    {user ? (
                        <>
                            {fallDetected ? (
                                <Stack.Navigator>
                                    <Stack.Screen name="Severity" component={Severity} />
                                </Stack.Navigator>
                            ) : (
                                <Stack.Navigator>
                                    <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
                                </Stack.Navigator>
                            )}
                        </>
                    ) : (
                        <Stack.Navigator>
                            <Stack.Screen name="Entry" component={Entry} />
                            <Stack.Screen name="SignUp" component={SignUp} />
                            <Stack.Screen name="Login" component={Login} />

                        </Stack.Navigator>
                    )}
                </NavigationContainer>
            ) : (
                <AppLoading />
            )}
        </>
    );
}