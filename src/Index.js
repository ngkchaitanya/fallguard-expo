import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FirebaseContext } from './contexts/FirebaseContext';
import AppLoading from './screens/AppLoading';
import { AuthContext } from './contexts/AuthContext';
import Entry from './screens/onboarding/Entry';
import SignUp from './screens/onboarding/SignUp';
import Login from './screens/onboarding/Login';
import HomeTabs from './screens/HomeTabs';
import { FallContext } from './contexts/FallContext';
import Severity from './screens/fall/Severity';
import Track from './screens/fall/Track';
import RescueTrack from './screens/fall/RescueTrack';
import Tips from './screens/hometabs/Tips';

// import LandingScreen from './screens/LandingScreen';

const Stack = createNativeStackNavigator();

export default function Index() {
    const { fbDB } = useContext(FirebaseContext);
    const { user } = useContext(AuthContext);
    const { fallDetected, currentFallId } = useContext(FallContext);
    // console.log("in index");

    return (
        <>
            {fbDB ? (
                <NavigationContainer>
                    {user ? (
                        <>
                            {currentFallId ? (
                                <Stack.Navigator >
                                    <Stack.Screen name="Track" component={Track} options={{ headerShown: false }}/>
                                </Stack.Navigator>
                            ) : fallDetected ? (
                                <Stack.Navigator>
                                    <Stack.Screen name="Severity" component={Severity} options={{ headerShown: false }}/>
                                    {/* <Stack.Screen name="ExistingTrack" component={ExistingTrack} />
                                                <Stack.Screen name="NewTrack" component={NewTrack} /> */}
                                    <Stack.Screen name="Track" component={Track}options={{ headerShown: false }} />
                                </Stack.Navigator>
                            ) : (
                                <Stack.Navigator>
                                    <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
                                    <Stack.Screen name="Tips" component={Tips} options={{ headerShown: false }} />
                                    <Stack.Screen name="RescueTrack" component={RescueTrack} options={{ headerShown: false }} />
                                </Stack.Navigator>
                            )}
                        </>
                    ) : (
                        <Stack.Navigator>
                             {/* <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} /> */}
                            <Stack.Screen name="Entry" component={Entry} options={{ headerShown: false }}/>
                            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
                            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>

                        </Stack.Navigator>
                    )}
                </NavigationContainer >
            ) : (
                <AppLoading />
            )
            }
        </>
    );
}
