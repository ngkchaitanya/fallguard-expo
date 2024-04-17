import { get, onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { getDistanceAndETA, getLocationAddress, getDistAndETABetweenUsers } from "../../util/ETA";
import { Card } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";

export default function RescueTrack({ route }) {
    const { fallResId, fallId, isVolunteer, isFamily } = route.params ? route.params : { fallResId: null, fallId: null, isVolunteer: true, isFamily: false };

    const { user, logoutUser } = useContext(AuthContext);
    const { fbDB } = useContext(FirebaseContext);

    const [fallResData, setFallResData] = useState();
    const [addVolFallResData, setAddVolFallResData] = useState();
    const [fallData, setFallData] = useState();

    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();
    const [address, setAddress] = useState();

    const [addVolDistance, setAddVolDistance] = useState();
    const [addVolDuration, setAddVolDuration] = useState();
    const [addVolAddress, setAddVolAddress] = useState();

    useEffect(() => {
        const fetchFallResData = async (localFallResId) => {
            console.log("fallresId - resmTrack: ", localFallResId);
            // get data here
            const fallResRef = ref(fbDB, 'fall_response/' + localFallResId)
            try {
                const snapshot = await get(fallResRef)
                if (snapshot.exists()) {
                    console.log("fall res snapshot: ", snapshot.val())

                    const snapshotFallResData = snapshot.val();
                    if (snapshotFallResData) {
                        setFallResData({
                            ...snapshotFallResData,
                            id: localFallResId
                        })

                        const fallRef = ref(fbDB, 'fall/' + snapshotFallResData.fallId)
                        const fallSnapshot = await get(fallRef)
                        if (fallSnapshot.exists()) {
                            console.log("fall snapshot: ", fallSnapshot.val())
                            const snapshotFallData = fallSnapshot.val();
                            if (snapshotFallData) {
                                setFallData({
                                    ...snapshotFallData,
                                    id: snapshotFallResData.fallId
                                })
                                console.log("After setting fall data")
                                console.log("deviceLat: ", snapshotFallData.deviceLat)
                                console.log("deviceLong: ", snapshotFallData.deviceLong)
                                var eta = await getDistanceAndETA(snapshotFallData.deviceLat, snapshotFallData.deviceLong)
                                console.log("eta: ", eta)
                                setDuration(eta.duration);
                                setDistance(eta.distance)

                                // @TODO: add address location here
                                var geoLocation = await getLocationAddress(snapshotFallData.deviceLat, snapshotFallData.deviceLong)
                                console.log("geoLocation: ", geoLocation)
                                setAddress(geoLocation.address)
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetch fall res data: ", error);
            }
        }

        fetchFallResData(fallResId)
    }, [])

    useEffect(() => {
        // check to see if any volunteer is also rescuing
        if (isFamily) {
            const fallResponsesRef = ref(fbDB, 'fall_response');
            try {
                onValue(fallResponsesRef, (snapshot) => {
                    var allFallResponses = snapshot.val();
                    console.log("res track - allFallResponses: ", allFallResponses)
                    if (allFallResponses) {
                        for (const [key, item] of Object.entries(allFallResponses)) {
                            // console.log("res track - fallId: ", fallId)
                            // console.log("res track - item.fallId: ", item.fallId)
                            // console.log("res track - fallResId: ", fallResId)
                            // console.log("res track - key: ", key)
                            // console.log("res track - isVolunteer: ", key)
                            if (item.fallId == fallId &&
                                key != fallResId &&
                                "volunteerId" in item && item.volunteerId) {
                                // additional volunteer rescue
                                console.log("Add vol fall res exists")
                                setAddVolFallResData({
                                    ...item,
                                    id: key
                                })

                                break
                            }
                        }
                    }
                })
            } catch (error) {
                console.error("Error: ", error)
            }
        }
    }, [])

    useEffect(() => {
        const fetchAddVolFallResETA = async (addVolFallResData, fallData) => {
            var eta = await getDistAndETABetweenUsers(
                addVolFallResData.rescueDeviceLat,
                addVolFallResData.rescueDeviceLong,
                fallData.deviceLat,
                fallData.deviceLong,
            )

            console.log("add vol eta: ", eta);

            var geoLocation = await getLocationAddress(
                addVolFallResData.rescueDeviceLat,
                addVolFallResData.rescueDeviceLong,
            )

            console.log("add vol geoLocation: ", geoLocation);

            setAddVolAddress(geoLocation.address)
            setAddVolDistance(eta.distance)
            setAddVolDuration(eta.duration)
        }

        if (addVolFallResData && fallData) {
            fetchAddVolFallResETA(addVolFallResData, fallData)
        }
    }, [addVolFallResData, fallData])

    return (
        <View>
            <Text>Rescue Fall Track: {fallResId}</Text>
            {isVolunteer && (
                <Text>isVolunteer: True</Text>
            )}
            {isFamily && (
                <Text>isFamily: True</Text>
            )}
            {fallResData && (
                <Card>
                    <Text>{isFamily ? "Your dear one's details: " : "Victim Details:"} </Text>
                    {fallData && fallData.victim && (
                        <View>
                            <Text>Victim Name: {fallData.victim.firstName} {fallData.victim.lastName}</Text>
                            <Text>Victim Email: {fallData.victim.email}</Text>
                        </View>
                    )}
                    <Text>Victim Location: {address}</Text>
                    <Text>ETA Distance: {distance}</Text>
                    <Text>ETA TIme: {duration}</Text>
                </Card>
            )}

            {addVolFallResData && isFamily && (
                <Card>
                    <Text>A volunteer is also trying to rescue your dear one!</Text>
                    {addVolFallResData.volunteer && (
                        <View>
                            <Text>Volunteer Name: {addVolFallResData.volunteer.firstName} {addVolFallResData.volunteer.lastName}</Text>
                            <Text>Volunteer Email: {addVolFallResData.volunteer.email}</Text>
                        </View>
                    )}
                    <Text>Volunteer Location: {addVolAddress}</Text>
                    <Text>Volunteer ETA Distance to Dear One: {addVolDistance}</Text>
                    <Text>Volunteer ETA TIme to Dear One: {addVolDuration}</Text>
                </Card>
            )}

            <Button title="Logout" onPress={logoutUser}>
            </Button>
        </View>
    )
}