import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FallContext } from "../../contexts/FallContext";
import { get, onValue, ref } from "firebase/database";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { ActivityIndicator, Button, Card } from "react-native-paper";
// import { Text } from "react-native-paper";

export default function Track({ route, navigation }) {
    const { fallId, isEmergency } = route.params ? route.params : { fallId: null, isEmergency: false };

    const { fbDB } = useContext(FirebaseContext);
    const { currentFallId, removeFall } = useContext(FallContext);

    const [fallData, setFallData] = useState();
    const [fallResponses, setFallResponses] = useState();
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const fetchFallData = async (localFallId) => {
            console.log("fallId - Track: ", localFallId);
            // get data here
            const fallRef = ref(fbDB, 'fall/' + localFallId)
            try {
                const snapshot = await get(fallRef)
                if (snapshot.exists()) {
                    console.log("fall snapshot: ", snapshot.val())

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
                        console.log("got all fall responses")

                        for (const [key, item] of Object.entries(userFamilyData)) {
                            console.log("item: ", item)
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
                        const usersRef = ref(fbDB, 'user');
                        // console.log(' --- usersRef:', usersRef);
                        get(usersRef).then((usersSnapshot) => {
                            // console.log(" --- usersSnapshot: ", usersSnapshot)
                            if (usersSnapshot.exists()) {
                                const usersData = usersSnapshot.val();
                                // console.log(" --- usersData: ", usersData)
                                if (usersData) {
                                    for (const item of fallResponses) {
                                        if ("familyId" in item.familyId && usersData[item.familyId]) {
                                            item.family = {
                                                id: item.familyId,
                                                ...usersData[item.familyId]
                                            }
                                        }

                                        if ("volunteerId" in item.volunteerId && usersData[item.volunteerId]) {
                                            item.volunteer = {
                                                id: item.volunteerId,
                                                ...usersData[item.volunteerId]
                                            }
                                        }
                                    }
                                }
                            }

                            setFallResponses(fallResponses);
                        });
                    }
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
        if (fallResponses) {

        }
    }, [fallResponses])

    return (
        <View style={styles.container}>
            {showLoading ? (
                <ActivityIndicator animating={true} size={40} color={'green'} />
            ) : (
                <>
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
                    {fallResponses && fallResponses.length && (
                        <View>
                            <Text>Fall Responses</Text>
                            {fallResponses.map((response) => (
                                <Card>
                                    <Text>id: {response.id}</Text>
                                </Card>
                            ))}
                        </View>
                    )}
                </>
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