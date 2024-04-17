import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View,Image } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { FallContext } from "../../contexts/FallContext";
import { get, onValue, push, ref } from "firebase/database";
import { Audio } from 'expo-av';
import { Button, Card } from "react-native-paper";
import { globalStyles } from "../../css/Global";
import { getDistanceAndETA, getLocationAddress } from "../../util/ETA";
import theme from "../../css/theme";

// import {  }

export default function Home({ navigation }) {
    const { resetFallDetection, storeFallResponse } = useContext(FallContext);

    const liveFallRef = useRef(null);

    const { fbDB } = useContext(FirebaseContext);
    const { user, logoutUser } = useContext(AuthContext);

    const [liveFall, setLiveFall] = useState();
    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();
    const [address, setAddress] = useState();
    const [userLat, setUserLat] = useState();
    const [userLong, setUserLong] = useState();

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

    const _familyAck = async () => {
        console.log("Acknowledge family")
        try {
            const fallResRef = ref(fbDB, 'fall_response');
            var fallResData = {
                fallId: liveFall.id,
                familyId: user.id,
                family: {
                    ...user
                },
                rescueDeviceLat: userLat,
                rescueDeviceLong: userLong,
                acceptedAt: new Date().getTime(),
                createdAt: new Date().getTime(),
            }
            const newFallResRef = await push(fallResRef, fallResData);
            const newFallResId = newFallResRef.key;

            // @TODO: store fall res
            storeFallResponse(newFallResId);

            navigation.replace('RescueTrack', {
                fallResId: newFallResId,
                isVolunteer: false,
                isFamily: true
            });
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    const _volunteerAccept = async () => {
        console.log("Volunteer Accept")

        try {
            const fallResRef = ref(fbDB, 'fall_response');
            var fallResData = {
                fallId: liveFall.id,
                volunteerId: user.id,
                volunteer: {
                    ...user
                },
                rescueDeviceLat: userLat,
                rescueDeviceLong: userLong,
                acceptedAt: new Date().getTime(),
                createdAt: new Date().getTime(),
            }
            const newFallResRef = await push(fallResRef, fallResData);
            const newFallResId = newFallResRef.key;

            // @TODO: store fall res
            storeFallResponse(newFallResId);

            navigation.replace('RescueTrack', {
                fallResId: newFallResId,
                isVolunteer: true,
                isFamily: false
            });
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    const _volunteerReject = () => {
        console.log("Volunteer Reject")
    }

    useEffect(() => {
        // listen to any falls
        const fallsRef = ref(fbDB, 'fall');
        try {
            onValue(fallsRef, (snapshot) => {
                var allFalls = snapshot.val();

                var liveFalls = [];
                if (allFalls) {
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
                                            const familyFell = familyMembers.find(member => member.id == fallItem.victimId);
                                            if (familyFell) {
                                                // legit family fall
                                                // var eta = getDistanceAndETA();
                                                // console.log("eta: ", eta)

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
                                                    // var eta = getDistanceAndETA(fallItem.deviceLat, fallItem.deviceLong);
                                                    // console.log("eta - vol: ", eta)
                                                    localLiveFall = {
                                                        ...fallItem,
                                                        victim: {
                                                            id: fallItem.victimId,
                                                            ...usersData[fallItem.victimId]
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
        const fallChange = async () => {
            console.log("sound and store")
            startSound();

            liveFallRef.current = liveFall
            console.log("liveFall: ", liveFall);
            console.log("liveFall.deviceLat: ", liveFall.deviceLat);
            console.log("liveFall.deviceLong: ", liveFall.deviceLong);
            eta = await getDistanceAndETA(liveFall.deviceLat, liveFall.deviceLong)
            console.log("eta: ", eta)

            var geoLocation = await getLocationAddress(liveFall.deviceLat, liveFall.deviceLong)
            console.log("geoLocation: ", geoLocation)
            setAddress(geoLocation.address)

            setDuration(eta.duration);
            setDistance(eta.distance)
            setUserLat(eta.userLat)
            setUserLong(eta.userLong)
        }

        if (liveFall && liveFallRef.current != liveFall) {
            fallChange()
        }
    }, [liveFall])

    return (
        <View style={styles.container}>
            {/* <Text style={styles.text}>Home</Text> */}
            {liveFall ?(
                <View style={styles.container}>
            <Text style={[styles.caption, , { fontWeight: 'bold' }]}>FALLGUARD</Text>
            <Text style={styles.caption}>Peace of mind in every step!</Text>
            <Image source={require('../../../assets/home.png')} style={styles.image} resizeMode="cover" />
            </View>):

            

            (<View style={styles.container}>
                {liveFall && (
                <Card style={globalStyles.marT20}>
                    {"isFamily" in liveFall && liveFall.isFamily ? (
                        <Text>Your fear one fell!!</Text>
                    ) : (
                        <Text>There is a fall victim nearby!</Text>
                    )}
                    <Text>Fall id: {liveFall.id}</Text>
                    <Text>Fall Time: {new Date(liveFall.createdAt).toLocaleString()}</Text>
                    {liveFall.victim && (
                        <View>
                            <Text>Victim id: {liveFall.victim.id}</Text>
                            <Text>Victim email: {liveFall.victim.email}</Text>

                        </View>
                    )}
                    {duration && (
                        <Text>Duration: {duration}</Text>
                    )}

                    {distance && (
                        <Text>Distance: {distance}</Text>
                    )}

                    {address && (
                        <Text>Address: {address}</Text>
                    )}

                    {"isFamily" in liveFall && liveFall.isFamily ? (
                        <Button mode="contained" onPress={_familyAck}>
                            I Acknowledge
                        </Button>
                    ) : (
                        <View style={styles.ctaContainer}>
                            <Button mode="contained" icon="check" onPress={_volunteerAccept}>Accept</Button>
                            <Button style={globalStyles.marT10} mode="outlined" icon="close" onPress={_volunteerReject}>Reject</Button>
                        </View>
                    )}


                </Card>
               
            )} </View>)}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF'
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
    },
    ctaContainer: {
        backgroundColor: 'green'
    },
    caption: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
        color: theme.colors.primary
    },
    image: {
        flex: 0.8,
        marginTop: 100,
        width: '100%',
        height: '100%',
    },
});