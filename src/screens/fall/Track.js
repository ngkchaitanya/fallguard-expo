import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FallContext } from "../../contexts/FallContext";
import { get, onValue, ref } from "firebase/database";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import { getDistAndETABetweenUsers, getLocationAddress } from "../../util/ETA";
// import { Text } from "react-native-paper";

export default function Track({ route, navigation }) {
    const { fallId, isEmergency } = route.params ? route.params : { fallId: null, isEmergency: false };

    const { fbDB } = useContext(FirebaseContext);
    const { currentFallId, removeFall } = useContext(FallContext);

    const [fallData, setFallData] = useState();
    const [fallResponses, setFallResponses] = useState();
    const [showLoading, setShowLoading] = useState(true);

    const [fallResponsesETA, setFallResponsesETA] = useState([]);
    const [victimRescued, setVictimRescued] = useState(false);

    const _rescueAck = () => {
        // remove falls
        removeFall()
    }

    useEffect(() => {
        const fetchFallData = async (localFallId) => {
            console.log("fallId - Track: ", localFallId);
            // get data here
            const fallRef = ref(fbDB, 'fall/' + localFallId)
            try {
                const snapshot = await get(fallRef)
                if (snapshot.exists()) {
                    // console.log("fall snapshot: ", snapshot.val())

                    const snapshotFallData = snapshot.val();
                    if (snapshotFallData) {
                        setFallData({
                            ...snapshotFallData,
                            id: localFallId
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetch fall data: ", error);
            }
        }

        const fetchFallResponses = (localFallId) => {
            const fallResponsesRef = ref(fbDB, 'fall_response');

            try {
                onValue(fallResponsesRef, (snapshot) => {
                    var allFallResponses = snapshot.val();

                    var fallResponses = [];

                    if (allFallResponses) {
                        console.log("track - got all fall responses")

                        for (const [key, item] of Object.entries(allFallResponses)) {
                            console.log("track - item.fallId: ", item.fallId)
                            console.log("track - localFallId: ", localFallId)
                            console.log("track - item.acceptedAt: ", item.acceptedAt)
                            if (item.fallId == localFallId && "acceptedAt" in item && item.acceptedAt) {
                                console.log("fall id matches")
                                // var fallResponseData = {
                                //     ...item,
                                //     id: key
                                // }
                                fallResponses.push({
                                    ...item,
                                    id: key
                                })

                                // if ("familyId" in item && item.familyId) {
                                //     // get family Data
                                //     console.log("family exists")
                                //     const familyRef = ref(fbDB, 'user/' + item.familyId);
                                //     get(familyRef).then(familySnapshot => {
                                //         if (familySnapshot.exists()) {
                                //             const familyData = familySnapshot.val();

                                //             if (familyData) {
                                //                 fallResponseData.family = {
                                //                     ...familyData,
                                //                     id: item.familyId
                                //                 }

                                //                 fallResponses.push(fallResponseData);
                                //             }
                                //         }

                                //     })

                                // } else if ("volunteerId" in item && item.volunteerId) {
                                //     console.log("volunteer exists")
                                //     // get volunteer Data
                                //     const volunteerRef = ref(fbDB, 'user/' + item.volunteerId);
                                //     get(volunteerRef).then(volunteerSnapshot => {
                                //         if (volunteerSnapshot.exists()) {
                                //             const volunteerData = volunteerSnapshot.val();

                                //             if (volunteerData) {
                                //                 fallResponseData.volunteer = {
                                //                     ...volunteerData,
                                //                     id: item.volunteerId
                                //                 }

                                //                 fallResponses.push(fallResponseData);
                                //             }
                                //         }

                                //     })

                                // } else {
                                //     // this case doesn't exist
                                // }
                            }
                        }
                    }

                    if (fallResponses && fallResponses.length) {
                        setFallResponses(fallResponses);
                    }

                    // if (fallResponses && fallResponses.length) {
                    //     const usersRef = ref(fbDB, 'user');
                    //     // console.log(' --- usersRef:', usersRef);
                    //     get(usersRef).then((usersSnapshot) => {
                    //         // console.log(" --- usersSnapshot: ", usersSnapshot)
                    //         if (usersSnapshot.exists()) {
                    //             const usersData = usersSnapshot.val();
                    //             // console.log(" --- usersData: ", usersData)
                    //             if (usersData) {
                    //                 for (const item of fallResponses) {
                    //                     if ("familyId" in item.familyId && usersData[item.familyId]) {
                    //                         item.family = {
                    //                             id: item.familyId,
                    //                             ...usersData[item.familyId]
                    //                         }
                    //                     }

                    //                     if ("volunteerId" in item.volunteerId && usersData[item.volunteerId]) {
                    //                         item.volunteer = {
                    //                             id: item.volunteerId,
                    //                             ...usersData[item.volunteerId]
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         }

                    //         setFallResponses(fallResponses);
                    //     });
                    // }
                });
            } catch (error) {
                console.error("Error onValue for fall responses: ", error);
            }
        }

        console.log("currentFallId: ", currentFallId);
        console.log("fallId: ", fallId);
        var localFallId = currentFallId ? currentFallId : (fallId ? fallId : null);
        if (localFallId) {
            fetchFallData(localFallId);

            fetchFallResponses(localFallId);

            setShowLoading(false);

            // emergency
            if (isEmergency) {
                // TODO: open the 911 page
                console.log("@@@ Show Emergency Dialer")
            }
        }
    }, [])

    useEffect(() => {
        console.log("useEffect - for geo")
        const fetchFallResponseETAs = async (fallResponses, fallData) => {
            // Creating a new array of objects
            const fallResponsesETA = await Promise.all(fallResponses.map(async (item) => {
                // Perform asynchronous operations
                const eta = await getDistAndETABetweenUsers(item.rescueDeviceLat, item.rescueDeviceLong, fallData.deviceLat, fallData.deviceLong);
                console.log("track - eta: ", eta);
                const geoLocation = await getLocationAddress(item.rescueDeviceLat, item.rescueDeviceLong);
                console.log("geoLocation: ", geoLocation);

                // Add additional information to the item
                return {
                    id: item.id,
                    eta: {
                        address: geoLocation.address,
                        duration: eta.duration,
                        distance: eta.distance
                    }
                };
            }));

            console.log("track - fallResponsesETA: ", fallResponsesETA)

            setFallResponsesETA(fallResponsesETA);
            // var localFallResponses = fallResponses
            // fetch etas
            // for (const item of localFallResponses) {
            //     var eta = await getDistAndETABetweenUsers(item.rescueDeviceLat, item.rescueDeviceLong, fallData.deviceLat, fallData.deviceLong)
            //     console.log("track - eta: ", eta);

            //     var geoLocation = await getLocationAddress(item.rescueDeviceLat, item.rescueDeviceLong)
            //     console.log("geoLocation: ", geoLocation);

            //     item.eta = {
            //         address: geoLocation.address,
            //         duration: eta.duration,
            //         distance: eta.distance
            //     }
            // }
        }

        console.log("useeffect - geo - fallResponses: ", fallResponses);
        console.log("useeffect - geo - fallData: ", fallData);
        if (fallResponses && fallData) {
            fetchFallResponseETAs(fallResponses, fallData)
        }
    }, [fallResponses, fallData])

    useEffect(() => {
        // check for fall live changes to rescue
        var localFallId = currentFallId ? currentFallId : (fallId ? fallId : null);
        if (localFallId) {
            const fallRef = ref(fbDB, 'fall/' + localFallId);
            try {
                onValue(fallRef, (snapshot) => {
                    var fallData = snapshot.val();
                    if (fallData && "resolvedAt" in fallData && fallData.resolvedAt) {
                        // victim has been successfully rescued
                        setVictimRescued(true)
                    }
                })
            } catch (error) {
                console.error("Error: ", error)
            }
        }

    }, [])

    const nearbyResources = [
        {
            name: "AdventHealth Tampa",
            duration: "5 min",
            distance: '1.2 miles'
        },
        {
            name: "USF Health",
            duration: "2 min",
            distance: '0.6 miles'
        },
        {
            name: "University Community Medical Center",
            duration: "6 min",
            distance: '1.5 miles'
        },
        {
            name: "Brandon Regional Hospital at Temple Terrace",
            duration: "7 min",
            distance: '2.8 miles'
        }
    ]

    return (
        <View style={styles.container}>
            {showLoading ? (
                <ActivityIndicator animating={true} size={40} color={'green'} />
            ) : (
                <View>
                    {victimRescued ? (
                        <View>
                            <Text>Help Arrived!</Text>
                            <Text>Icon goes here</Text>
                            <Button mode="contained" icon="check" onPress={_rescueAck}>
                                Got It
                            </Button>
                        </View>
                    ) : (
                        <View>
                            <Text>Track</Text>
                            <Button onPress={() => removeFall()}>
                                Remove Fall
                            </Button>
                            {fallData && (
                                <Card>
                                    <Text>Fall Data:</Text>
                                    <Text>id: {fallData.id}</Text>
                                    <Text>deviceName: {fallData.deviceName}</Text>
                                    <Text>severity: {fallData.severity}</Text>
                                    <Text>deviceLat: {fallData.deviceLat}</Text>
                                    <Text>deviceLong: {fallData.deviceLong}</Text>
                                    <Text>createdAt: {fallData.createdAt}</Text>
                                </Card>
                            )}
                            {fallResponses && fallResponses.length ? (
                                <View>
                                    <Text>Help is on the way</Text>
                                    {fallResponses.map((response) => (
                                        <Card key={response.id}>
                                            <Text>id: {response.id}</Text>
                                            <Text>Rescue by: {response.familyId ? "Family member" : "Volunteer"}</Text>
                                            {response.family && (
                                                <View>
                                                    <Text>Family Member Name: {response.family.firstName} {response.family.lastName}</Text>
                                                    <Text>Family Member Email: {response.family.email}</Text>
                                                </View>
                                            )}
                                            {response.volunteer && (
                                                <View>
                                                    <Text>volunteer Member Name: {response.volunteer.firstName} {response.volunteer.lastName}</Text>
                                                    <Text>volunteer Member Email: {response.volunteer.email}</Text>
                                                </View>
                                            )}
                                            {fallResponsesETA && fallResponsesETA.length && (
                                                <Text>flflflfl: {fallResponsesETA.length}</Text>
                                            )}
                                            {fallResponsesETA && fallResponsesETA.length && (
                                                <>
                                                    <Text>alalalala</Text>
                                                    {fallResponsesETA.map((responseETA) => (
                                                        <View key={responseETA.id}>
                                                            {responseETA.id == response.id && (
                                                                <View>
                                                                    <Text>Rescuer Location: {responseETA.eta.address}</Text>
                                                                    <Text>Rescuer Distance: {responseETA.eta.distance}</Text>
                                                                    <Text>Rescuer Time to reach: {responseETA.eta.duration}</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    ))}
                                                </>
                                            )}
                                        </Card>
                                    ))}
                                </View>
                            ) : (
                                <Card>
                                    <Text>Hang tight while we get you help!</Text>
                                    <Text>Image comes here</Text>
                                </Card>
                            )}

                            <View>
                                <Text>Nearby Help Respurces</Text>
                                {nearbyResources.map((resource) => (
                                    <View key={resource.name}>
                                        <Text>{resource.name}</Text>
                                        <Text>Distance: {resource.duration}</Text>
                                        <Text>Duration: {resource.distance}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )
            }
        </View >
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
});