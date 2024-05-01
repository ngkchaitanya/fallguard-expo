import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export const FallContext = createContext();

export const FallProvider = ({ children }) => {
    const [accData, setAccData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [gyroData, setGyroData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [fallDetected, setFallDetected] = useState(false);
    const [accSubscription, setAccSubscription] = useState(null);
    const [gyroSubscription, setGyroSubscription] = useState(null);
    const [currentFallId, setCurrentFallId] = useState(null);

    const _slow = () => {
        Accelerometer.setUpdateInterval(1000)
        Gyroscope.setUpdateInterval(1000)
    };

    const _fast = () => {
        Accelerometer.setUpdateInterval(16)
        Gyroscope.setUpdateInterval(16)
    };

    const fallThreshold = 2;
    const orientationThreshold = 1.5;

    const _subscribe = () => {
        // console.log("--- Subscription ---")
        setFallDetected(false);

        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);

        setAccSubscription(
            Accelerometer.addListener(AccelerometerData => {
                setAccData(AccelerometerData);
            })
        );

        setGyroSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setGyroData(gyroscopeData);
            })
        );
    };

    const _unsubscribe = () => {
        // console.log("--- Unsubscription ---")
        accSubscription && accSubscription.remove();
        gyroSubscription && gyroSubscription.remove();

        setAccSubscription(null);
        setGyroSubscription(null);
    };

    const resetFallDetection = () => {
        // console.log("came to reset!!")
        // reset values

        setAccData({
            x: 0,
            y: 0,
            z: 0,
        });

        setGyroData({
            x: 0,
            y: 0,
            z: 0,
        })

        setFallDetected(false);
        _subscribe();
    }

    const _localFallDetect = () => {
        _unsubscribe();
        setFallDetected(true);
    }

    const storeFall = async (fallId) => {
        try {
            await AsyncStorage.setItem('fall-id', fallId);
        } catch (e) {
            // saving error
            console.error("Error while trying to store fall-id: ", e);
        }
    }

    const removeFall = async () => {
        try {
            await AsyncStorage.removeItem('fall-id')

            setCurrentFallId(null);
            
            resetFallDetection();
        } catch (error) {
            console.error("Error while trying to remove fall-id: ", error);
        }
    }

    const storeFallResponse = async (fallResId) => {
        try {
            await AsyncStorage.setItem('fall-res-id', fallResId);
        } catch (e) {
            // saving error
            console.error("Error while trying to store fall-res-id: ", e);
        }
    }

    const removeFallResponse = async () => {
        try {
            await AsyncStorage.removeItem('fall-res-id')

            setCurrentFallId(null);
        } catch (error) {
            console.error("Error while trying to remove fall-res-id: ", error);
        }
    }

    useEffect(() => {
        // console.log("--- Initial Subscription UseEffect ---")
        // @TODO: check
        _subscribe();
        return () => _unsubscribe();
    }, []);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            // setLocation(location);
        })();
    }, []);

    useEffect(() => {
        // @TODO: check for any existing falls
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('fall-id');
                // console.log("get fall-id value: ", value)
                if (value !== null) {
                    // value previously stored
                    setCurrentFallId(value);
                }
            } catch (e) {
                // error reading value
                console.error("Error while trying to get stored fall-id: ", e);
            }
        };

        getData();
    }, [])

    useEffect(() => {
        if (!fallDetected) {
            // console.log("--- Fall Check UseEffect ---")
            const acceleration = Math.sqrt(accData.x * 2 + accData.y * 2 + accData.z ** 2);

            if (acceleration > fallThreshold) {
                const orientationChange = Math.sqrt(gyroData.x * 2 + gyroData.y * 2 + gyroData.z ** 2);

                if (orientationChange > orientationThreshold) {
                    // fallDetected = true;
                    // console.log('@@@ Fall detected!');
                    _unsubscribe();
                    setFallDetected(true);

                    Toast.show({
                        type: 'error',
                        text1: "Fall Detected!",
                    });
                }
            }
        }
    }, [accData, gyroData, fallDetected])

    return (
        <FallContext.Provider value={{ fallDetected, accData, gyroData, currentFallId, resetFallDetection, storeFall, removeFall, storeFallResponse, removeFallResponse }}>
            {/* <View style={styles.container}>
                <Text style={styles.text}>Accelerometer:</Text>
                <Text style={styles.text}>x: {accData.x}</Text>
                <Text style={styles.text}>y: {accData.y}</Text>
                <Text style={styles.text}>z: {accData.z}</Text>
                <Text style={styles.text}>Gyroscope:</Text>
                <Text style={styles.text}>x: {gyroData.x}</Text>
                <Text style={styles.text}>y: {gyroData.y}</Text>
                <Text style={styles.text}>z: {gyroData.z}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={_localFallDetect}>
                <Text style={styles.buttonText}>Detect Fall</Text>
            </TouchableOpacity> */}
            {children}
        </FallContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    text: {
        textAlign: 'center',
    },
    button: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
    },
    buttonText: {
        color: '#FFF'
    },
});