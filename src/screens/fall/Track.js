import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView,Image } from "react-native";
import { FallContext } from "../../contexts/FallContext";
import { get, onValue, ref } from "firebase/database";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import { getDistAndETABetweenUsers, getLocationAddress } from "../../util/ETA";
import theme from "../../css/theme";
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
        if (fallResponses &&fallResponses.length && fallData) {
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
                <ScrollView>
                <View>
                    {victimRescued ? (
                        <View style= {{marginTop:80}}>
                            <Text style={[styles.caption, { fontWeight: 'bold' }]}>Help Arrived!</Text>
                            <Image source={require('../../../assets/helparrived.png')} style={styles.image} resizeMode="cover" />
                            <Button mode="contained" icon="check" onPress={_rescueAck} style={styles.lastbutton}>
                                Got It
                            </Button>
                        </View>
                    ) : (
                        <View>
                            {/* <Text>Track</Text> */}
                            {/* <Button onPress={() => removeFall()}>
                                Remove Fall

                            </Button> */}


                            {/* {fallData && (
                                <Card>
                                    <Text>Fall Data:</Text>
                                    <Text>id: {fallData.id}</Text>
                                    <Text>deviceName: {fallData.deviceName}</Text>
                                    <Text>severity: {fallData.severity}</Text>
                                    <Text>deviceLat: {fallData.deviceLat}</Text>
                                    <Text>deviceLong: {fallData.deviceLong}</Text>
                                    <Text>createdAt: {fallData.createdAt}</Text>
                                </Card>
                            )} */}
                            {fallResponses && fallResponses.length && fallResponsesETA && fallResponsesETA.length ? (
                                <View>
                                    <Text style={{ fontWeight: 'bold', marginTop: 10, color: 'black',textAlign:"center" }}>HELP IS ON THE WAY!</Text>
                                    {fallResponses.map((response) => (
                                        <Card style={styles.cardstyle} key={response.id}>
                                            {/* <Text>id: {response.id}</Text> */}
                                            <Text style={styles.textStyle}>{response.familyId ? "FAMILY MEMBER" : "VOLUNTEER"}</Text>
                                            <View style={styles.divider} />
                                            {response.family && (
                                                <View>
                                                    <Text style={styles.textStyle}>{response.family.firstName} {response.family.lastName}</Text>
                                                    {/* <Text style={styles.textStyle}>Family Member Email: {response.family.email}</Text> */}
                                                </View>
                                            )}
                                            {response.volunteer && (
                                                <View>
                                                    <Text style={styles.textStyle}>{response.volunteer.firstName} {response.volunteer.lastName}</Text>
                                                    {/* <Text>volunteer Member Email: {response.volunteer.email}</Text> */}
                                                </View>
                                            )}
                                            {/* {fallResponsesETA && fallResponsesETA.length && (
                                                <Text>flflflfl: {fallResponsesETA.length}</Text>
                                            )} */}

                        
                                            {fallResponsesETA && fallResponsesETA.length && (
                                                <>
                                                    {/* <Text>alalalala</Text> */}
                                                    {fallResponsesETA.map((responseETA) => (
                                                        <View key={responseETA.id}>
                                                            {responseETA.id == response.id && (
                                                                <View style={styles.location}>
                                                                <Text style={[styles.alertText, {textAlign:"center"}]} >FALL LOCATION</Text>
                                                                <Text style={[styles.alertText, {padding:10} , {fontWeight:'bold'}]}>{responseETA.eta.address}</Text>
                                                                </View>
                                                                // <View>
                                                                //     <Text>Rescuer Location: {responseETA.eta.address}</Text>
                                                                //     <Text>Rescuer Distance: {responseETA.eta.distance}</Text>
                                                                //     <Text>Rescuer Time to reach: {responseETA.eta.duration}</Text>
                                                                // </View>
                                                            )}
                                                            {responseETA.id == response.id && (
                        <View style={styles.etaview}>
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"} ]} >Distance</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{responseETA.eta.distance}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"}]} >ETA</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{responseETA.eta.duration}</Text>
                          </View>
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
                                <View>
                                    <Text style={[styles.message, { fontWeight: 'bold' }, { fontSize: 30 }]}>Hang tight we are coming for you!</Text>
                                    <ActivityIndicator animating={true} color={theme.colors.secondary} size={70} marginBottom={100} />
                                </View>
                            )}

                            <View style={styles.resourcesContainer}>
                                <Text style={styles.resourcesTitle}>Nearby Help Resources</Text>
                                <View style={styles.resourcesTable}>
                                    {nearbyResources.map((resource) => (
                                        <View key={resource.name} style={styles.resourceRow}>
                                            <Text style={styles.resourceTitle}>{resource.name}</Text>
                                            <View style={styles.resourceETA}>
                                                <View style={styles.resourceETACell}>
                                                    <Text style={styles.resourceETACellLabel}>Distance: </Text>
                                                    <Text style={styles.resourceETACellText}>{resource.distance}</Text>
                                                </View>
                                                <View style={styles.resourceETACell}>
                                                    <Text style={styles.resourceETACellLabel}>Distance: </Text>
                                                    <Text style={styles.resourceETACellText}>{resource.distance}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                </ScrollView>
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
        marginTop:60
    },
    text: {
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 100,
        marginBottom: 80,
        color: theme.colors.primary
    },
    cardstyle: {
        backgroundColor:theme.colors.primary,
        marginTop: 20,
    },
    textStyle: {
        
        marginLeft:10,
        marginBottom:5
    },
    divider: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 8,
      },
      location: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10, // Adjust the value to change the roundness of the corners
        padding: 10,
      },
      etaview: {
        flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden', 
    marginBottom:10,
    marginTop: 10,
      },
      half: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      caption: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
        color: theme.colors.primary
    },
    image: {
        //    flex:1,
        marginTop:20,
             width: '100%',
            height: 400,
        },
        lastbutton: {
            marginTop:20,
           
            justifyContent: 'center',
                alignItems: 'center',
               
                padding: 10,
          },
    resourcesContainer: {
        // backgroundColor: 'red',
        marginTop: 20,
    },
    resourcesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resourcesTable: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 8,
        marginTop: 10,
        overflow: "hidden"
    },
    resourceRow: {
        borderWidth: 0.5,
        borderColor: theme.colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 10
    },
    resourceTitle: {
        fontSize: 20
    },
    resourceETA: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 4
        // justifyContent: 'flex-start',
        // backgroundColor: 'red'
    },
    resourceETACell: {
        flex: 1,
        flexDirection: 'row'
    },
    resourceETACellLabel: {
        color: '#666666'
    },
    resourceETACellText: {
        color: '#666666',
        fontWeight: 'bold'
    }
});