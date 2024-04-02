import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import FallDetection from './src/screens/FallDetection';
// import Entry from './src/screens/Entry';
// import Home from './src/screens/Home';

// import { FirebaseContext } from './src/contexts/FirebaseContext';
import Home from './screens/Home';
import Entry from './screens/Entry';
import FallDetection from './screens/FallDetection';
import { FirebaseContext } from './contexts/FirebaseContext';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function Index() {
    const { fbDB } = useContext(FirebaseContext);
    console.log("in index");

    return (
        //   <NavigationContainer>
        //     {fbDB ? (
        //       <Stack.Navigator>
        //         <Stack.Screen name="Home" component={Home} />
        //         <Stack.Screen name="Entry" component={Entry} />
        //         <Stack.Screen name="Fall" component={FallDetection} />
        //       </Stack.Navigator>
        //     ) : (
        //       <Stack.Navigator>
        //         <Stack.Screen name="Entry" component={Entry} />
        //       </Stack.Navigator>
        //     )}
        //   </NavigationContainer>
        <>
            {fbDB ? (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Entry" component={Entry} />
                        <Stack.Screen name="Fall" component={FallDetection} />
                    </Stack.Navigator>
                </NavigationContainer>
            ) : (
                <Entry />
            )}
        </>
    );
}
