import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { FallContext } from "../../contexts/FallContext";
import { get, onValue, ref } from "firebase/database";
import { Audio } from 'expo-av';
import { Card } from "react-native-paper";

// import {  }

export default function Home() {
    const { resetFallDetection } = useContext(FallContext);

    const liveFallRef = useRef(null);

    const { fbDB } = useContext(FirebaseContext);
    const { user, logoutUser } = useContext(AuthContext);

    const [liveFall, setLiveFall] = useState();

    const _resetFall = () => {
        resetFallDetection();
    }

    const startSound = async () => {
        console.log('Loading Sound');

        const soundObject = new Audio.Sound();

        try {
            await soundObject.loadAsync(require('../../../assets/audio/slow-alarm.mp3'));
            await soundObject.playAsync();
            // await soundObject.setIsLoopingAsync(true); // Enable looping

            // setSound(soundObject);

            // Haptics.selectionAsync(); // Trigger haptic feedback
        } catch (error) {
            console.error('Failed to load sound', error);
        }
    }

    useEffect(() => {
        // listen to any falls
        const fallsRef = ref(fbDB, 'fall');
        try {
            onValue(fallsRef, (snapshot) => {
                var allFalls = snapshot.val();

                var liveFalls = [];
                for (const [key, item] of Object.entries(allFalls)) {

                    if ("resolvedAt" in item && item.resolvedAt) {
                        // fall is resolved
                    } else {
                        liveFalls.push({
                            id: key,
                            ...item
                        })
                    }
                }

                // var liveFall = {}
                if (liveFalls && liveFalls.length) {
                    console.log("got all falls: ")

                    // if family member, alert
                    // fetch all users first
                    const usersRef = ref(fbDB, 'user');
                    // console.log(' --- usersRef:', usersRef);
                    get(usersRef).then((usersSnapshot) => {
                        // console.log(" --- usersSnapshot: ", usersSnapshot)
                        if (usersSnapshot.exists()) {
                            const usersData = usersSnapshot.val();
                            if (usersData) {
                                const usersFamilyRef = ref(fbDB, 'user_family');
                                get(usersFamilyRef).then((usersFamilySnapshot) => {
                                    var familyMembers = [];

                                    if (usersFamilySnapshot.exists) {
                                        const usersFamilyData = usersFamilySnapshot.val();
                                        if (usersFamilyData) {
                                            for (const [key, item] of Object.entries(usersFamilyData)) {
                                                if ("acceptedAt" in item && item.acceptedAt) {
                                                    console.log("family member item: ", item)
                                                    if (item.userId == user.id) {
                                                        familyMembers.push({
                                                            id: item.familyMemberId,
                                                            ...usersData[item.familyMemberId]
                                                        })
                                                    } else if (item.familyMemberId == user.id) {
                                                        familyMembers.push({
                                                            id: item.userId,
                                                            ...usersData[item.userId]
                                                        })
                                                    } else {
                                                        // do nothing
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    console.log("Family Members: ", familyMembers)

                                    // check if the fall is from them
                                    // family takes priority over volunteer
                                    // @TODO: assume that only one family at a time
                                    //  restrict another
                                    //  family - only acknowledge
                                    var localLiveFall = null;
                                    if (familyMembers && familyMembers.length) {
                                        console.log("inside family members")
                                        for (const fallItem of liveFalls) {
                                            const familyFell = familyMembers.find(member => member.id == fallItem.userId);
                                            if (familyFell) {
                                                // legit family fall
                                                localLiveFall = {
                                                    ...fallItem,
                                                    isFamily: true,
                                                    victim: {
                                                        ...familyFell
                                                    }
                                                }
                                                setLiveFall(localLiveFall);

                                                // sound alarm
                                                // startSound()

                                                // show on the screen
                                                break;




                                            }
                                        }
                                    }

                                    // volunteer
                                    // show the first valid fall
                                    // once accepted, restrict others
                                    // once rejected, don't show - remove from the list
                                    console.log("localLiveFall: ", localLiveFall);
                                    console.log("user.isVolunteer: ", user.isVolunteer);

                                    if (!localLiveFall && user.isVolunteer) {
                                        console.log("inside volunteers space")
                                        const fallResponsesRef = ref(fbDB, 'fall_response');
                                        // console.log(' --- usersRef:', usersRef);
                                        get(fallResponsesRef).then((fallResponsesSnapshot) => {
                                            const fallResponsesData = fallResponsesSnapshot.val();
                                            console.log("fallResponsesData: ", fallResponsesData)
                                            var rejectedFallIds = []
                                            if (fallResponsesData) {
                                                for (const [key, fallResponse] of Object.entries(fallResponsesData)) {
                                                    if ("volunteerId" in fallResponse && fallResponse.volunteerId == user.id && "rejectedAt" in fallResponse && fallResponse.rejectedAt) {
                                                        rejectedFallIds.push(fallResponse.fallId);
                                                    }
                                                }
                                            }

                                            console.log("rejectedFallIds : ", rejectedFallIds)
                                            for (const fallItem of liveFalls) {
                                                if (rejectedFallIds && rejectedFallIds.length && rejectedFallIds.indexOf(fallItem) !== -1) {
                                                    // fall has already been rejected
                                                } else {
                                                    // new fall
                                                    // @TODO: check distance
                                                    console.log("--- Should decide based on distance ---")
                                                    localLiveFall = {
                                                        ...fallItem,
                                                        victim: {
                                                            id: fallItem.userId,
                                                            ...usersData[fallItem.userId]
                                                        }
                                                    }
                                                    setLiveFall(localLiveFall);

                                                    break;
                                                }
                                            }
                                        });

                                    }
                                })
                            }
                        }
                    });


                }
            });
        } catch (error) {
            console.error("Error: ", error)
        }
    }, [])

    useEffect(() => {
        console.log("useEffect - sound - check")
        console.log("liveFall: ", liveFall)
        console.log("liveFallRef.current: ", liveFallRef.current)
        if (liveFall && liveFallRef.current != liveFall) {
            console.log("sound and store")
            startSound();
            liveFallRef.current = liveFall
        }
    }, [liveFall])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>

            {user && user.isVolunteer && (
                <View>
                    <Text>Volunteer stuff</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={_resetFall}>
                <Text style={styles.buttonText}>Reset Fall Detection</Text>
            </TouchableOpacity>

            {liveFall && (
                <Card>
                    <Text>Fall id: {liveFall.id}</Text>
                    {liveFall.victim && (
                        <View>
                            <Text>Victim id: {liveFall.victim.id}</Text>
                            <Text>Victim email: {liveFall.victim.email}</Text>

                        </View>
                    )}
                </Card>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    text: {
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 15,
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
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    fallText: {
        textAlign: 'center',
        fontSize: 24,
        color: 'red'
    },
    fallButton: {
        backgroundColor: 'blue',
    },
    fallButtonText: {
        color: "#FFF"
    }
});