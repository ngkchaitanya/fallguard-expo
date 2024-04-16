import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../css/Global";
import { FAB, Button, Card, ProgressBar } from 'react-native-paper';
import { FallContext } from "../../contexts/FallContext";
import { useCountdown, CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { push, ref } from "firebase/database";
import { AuthContext } from "../../contexts/AuthContext";
import { deviceName } from "expo-device";
import * as Device from 'expo-device';

export default function Severity({ navigation }) {
    const { fbDB } = useContext(FirebaseContext);
    const { user } = useContext(AuthContext);
    const { resetFallDetection, accData, gyroData, storeFall } = useContext(FallContext);

    const fallsRef = ref(fbDB, 'fall');

    const [sound, setSound] = useState();
    const [pauseTimer, setPauseTimer] = useState(false);
    // const [timeUp, setTimeUp] = useState(false);
    const [fallData, setFallData] = useState({
        victimId: user.id,
        deviceName: Device.deviceName,
        deviceBrand: Device.brand,
        deviceModelId: Device.modelId,
        deviceModelName: Device.modelName,
        fallAccData: accData,
        fallGyroData: gyroData,
        isFalseDetection: false,
        isConscious: true,
        severity: null, // mild, moderate, extreme
        emergencyCalledAt: null,
        createdAt: new Date().getTime()
    });

    // const triggerVolunteerSystem = async (isConscious) => {
    //     try {
    //         var localFallData = {
    //             ...fallData,
    //             isConscious: isConscious,
    //             // severity: isConscious ? ..
    //         }
    //         await push(fallsRef, localFallData);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    const _handleNoFall = async () => {
        stopSound();

        var localFallData = {
            ...fallData,
            isFalseDetection: true,
            isConscious: true,
        }

        try {
            await push(fallsRef, localFallData);
        } catch (error) {
            console.error('Error:', error);
        }

        resetFallDetection();
    }

    const _handleNoHelp = async () => {
        stopSound();

        var localFallData = {
            ...fallData,
            isFalseDetection: false,
            isConscious: true,
            severity: "mild"
        }

        try {
            await push(fallsRef, localFallData);
        } catch (error) {
            console.error('Error:', error);
        }

        resetFallDetection();
    }

    const _handleHelp = async () => {
        stopSound();
        console.log("volunteer system")

        var localFallData = {
            ...fallData,
            isFalseDetection: false,
            isConscious: true,
            severity: "moderate"
        }

        try {
            const newFallRef = await push(fallsRef, localFallData);
            const newFallId = newFallRef.key;

            // @TODO: store fall
            storeFall(newFallId);

            navigation.replace('Track', {
                fallId: newFallId,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const _handleEmergencyHelp = async () => {
        stopSound();
        console.log("Emergency!")

        var localFallData = {
            ...fallData,
            isFalseDetection: false,
            isConscious: true,
            severity: "extreme"
        }

        try {
            const newFallRef = await push(fallsRef, localFallData);
            const newFallId = newFallRef.key;

            // @TODO: store fall
            storeFall(newFallId);

            // @TODO: call emergency help
            // as the victim is able to interact
            console.log("Show emergency call screen!")
            navigation.replace('Track', {
                fallId: newFallId,
                isEmergency: true,
            });

            // setPauseTimer(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const _handleNoResponse = async () => {
        stopSound();
        console.log("No response - time up!")

        var localFallData = {
            ...fallData,
            isFalseDetection: false,
            isConscious: false,
            severity: "extreme"
        }

        try {
            const newFallRef = await push(fallsRef, localFallData);
            const newFallId = newFallRef.key;

            // @TODO: store fall
            storeFall(newFallId);

            console.log("Show emergency call screen!")
            navigation.replace('Track', {
                fallId: newFallId,
                isEmergency: true,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const startSound = async () => {
        console.log('Loading Sound');

        const soundObject = new Audio.Sound();

        try {
            await soundObject.loadAsync(require('../../../assets/audio/slow-alarm.mp3'));
            await soundObject.playAsync();
            await soundObject.setIsLoopingAsync(true); // Enable looping

            setSound(soundObject);

            // Haptics.selectionAsync(); // Trigger haptic feedback
        } catch (error) {
            console.error('Failed to load sound', error);
        }
    }

    const stopSound = async () => {
        console.log('Unloading Sound');
        if (sound) {
            await sound.unloadAsync();

            setSound();
        }

        // @TODO: check vibration
        // Haptics.stopAsync();
    }

    useEffect(() => {
        startSound();

        return () => {
            stopSound();
        };
    }, [])

    useEffect(() => {
        console.log("severity - navigation")
        const unsubscribe = navigation.addListener('blur', () => {
            console.log("severity - navigation - unfocus")

            // Do something when the screen is unfocused
            stopSound();
        });

        return unsubscribe;
    }, [navigation]);

    // useEffect(() => {
    //     return sound
    //         ? () => {
    //             console.log("in sound")
    //             if (timeUp) {
    //                 console.log('Unloading Sound');
    //                 sound.unloadAsync();
    //             } else {
    //                 console.log('Replaying Sound');
    //                 sound.replayAsync();
    //             }
    //         }
    //         : undefined;
    // }, [sound]);

    // useEffect(() => {
    //     const replaySound = async () => {
    //         await sound.replayAsync();
    //     }

    //     if (sound) {

    //     } else {
    //         if (timeUp) {
    //             stopSound();
    //         } else {
    //             replaySound();
    //         }
    //     }
    // }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Fall Detected!</Text>
            <Text style={[styles.text, globalStyles.marT10]}>We have detected a Fall. Do you need help?</Text>
            <View style={[styles.countdownContainer, globalStyles.marT10]}>
                <CountdownCircleTimer
                    // isPlaying
                    duration={10}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[20, 10, 5, 0]}
                    size={40}
                    strokeWidth={6}
                    onComplete={_handleNoResponse}
                    isPlaying={pauseTimer ? false : true}
                >
                    {({ remainingTime }) => <Text>{remainingTime}</Text>}
                </CountdownCircleTimer>

                {/* <ProgressBar progress={0.5} /> */}
            </View>

            <Button mode="contained"
                buttonColor="#DAAF2A"
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonText}
                onPress={_handleNoFall}
            >
                Not A Fall
            </Button>

            <View style={styles.fallOptionsContainer}>
                <Card style={styles.choiceCard} contentStyle={styles.choiceCard1Content}>
                    <Text style={styles.choiceCardText}>Either you haven't fell or you don't need any help.</Text>
                    <Button mode="contained"
                        buttonColor="#DAAF2A"
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonText}
                        onPress={_handleNoHelp}
                    >
                        I don't need any help!
                    </Button>
                </Card>
                <Card style={styles.choiceCard} contentStyle={styles.choiceCard2Content}>
                    <Text style={styles.choiceCardText}>I feel moderate pain and I would need help frpm someone.</Text>
                    <Button mode="contained"
                        buttonColor="#FFA04B"
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonText}
                        onPress={_handleHelp}
                    >
                        I need help!
                    </Button>
                </Card>
                <Card style={styles.choiceCard} contentStyle={styles.choiceCard3Content}>
                    <Text style={styles.choiceCardText}>I'm in extreme pain and need immediate help.</Text>
                    <Button mode="contained"
                        buttonColor="#FF6645"
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonText}
                        onPress={_handleEmergencyHelp}
                    >
                        I need emergency help!
                    </Button>
                </Card>

            </View>
            <View style={styles.fabContainer}>
                <FAB
                    icon="alert-octagon"
                    style={styles.fabButton}
                    onPress={() => console.log('Pressed - call 911')}
                    label="Call 911"
                    color="#fff"
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        // backgroundColor: 'green'
    },
    text: {
        textAlign: 'center',
    },
    button: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 10,
        marginTop: 16
    },
    buttonContent: {
        // backgroundColor: 'red',
        padding: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
    },
    fallOptionsContainer: {
        // backgroundColor: 'yellow'
    },
    fabContainer: {
        position: 'absolute',
        // margin: '2%',
        left: 0,
        right: 0,
        bottom: 0,
        // width: '100%',
        // backgroundColor: 'blue',
        padding: 16
    },
    fabButton: {
        backgroundColor: 'red',
    },
    choiceCard: {
        // padding: 16,
        // backgroundColor: 'rgba(218, 175, 42, 0.8)',
        overflow: 'hidden',
        marginTop: 16
    },
    choiceCard1Content: {
        padding: 16,
        backgroundColor: 'rgba(218, 175, 42, 0.35)',
    },
    choiceCard2Content: {
        padding: 16,
        backgroundColor: 'rgba(255, 160, 75, 0.35)',
    },
    choiceCard3Content: {
        padding: 16,
        backgroundColor: 'rgba(255, 102, 69, 0.35)',
    },
    choiceCardText: {
        textAlign: "center"
    },
    countdownContainer: {
        backgroundColor: 'pink',
        alignItems: 'center'
        // height: 40
    }
});