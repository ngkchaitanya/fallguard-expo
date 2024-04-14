import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import Toast from 'react-native-toast-message';

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
        console.log("--- Subscription ---")
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
        console.log("--- Unsubscription ---")
        accSubscription && accSubscription.remove();
        gyroSubscription && gyroSubscription.remove();

        setAccSubscription(null);
        setGyroSubscription(null);
    };

    const resetFallDetection = () => {
        console.log("came to reset!!")
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
        setFallDetected(true);
    }

    useEffect(() => {
        console.log("--- Initial Subscription UseEffect ---")
        // _subscribe();
        return () => _unsubscribe();
    }, []);

    useEffect(() => {
        if (!fallDetected) {
            console.log("--- Fall Check UseEffect ---")
            const acceleration = Math.sqrt(accData.x * 2 + accData.y * 2 + accData.z ** 2);

            if (acceleration > fallThreshold) {
                const orientationChange = Math.sqrt(gyroData.x * 2 + gyroData.y * 2 + gyroData.z ** 2);

                if (orientationChange > orientationThreshold) {
                    // fallDetected = true;
                    console.log('@@@ Fall detected!');
                    setFallDetected(true);
                    _unsubscribe();

                    Toast.show({
                        type: 'error',
                        text1: "Fall Detected!",
                    });
                }
            }
        }
    }, [accData, gyroData, fallDetected])

    return (
        <FallContext.Provider value={{ fallDetected, resetFallDetection }}>
            <View style={styles.container}>
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
            </TouchableOpacity>
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