import { get, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { getDistanceAndETA, getLocationAddress } from "../../util/ETA";
import { Card } from "react-native-paper";

export default function RescueTrack({ route }) {
    const { fallResId, isVolunteer, isFamily } = route.params ? route.params : { fallResId: null, isVolunteer: true, isFamily: false };

    const { fbDB } = useContext(FirebaseContext);

    const [fallResData, setFallResData] = useState();
    const [fallData, setFallData] = useState();

    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();
    const [address, setAddress] = useState();

    const [distance1, setDistance1] = useState();
    const [duration1, setDuration1] = useState();
    const [address1, setAddress1] = useState();


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
                    <Text>Victim Details: </Text>
                    {fallResData.victim && (
                        <View>
                            <Text>Victim Name: {fallResData.victim.firstName} {fallResData.victim.lastName}</Text>
                            <Text>Victim Email: {fallResData.victim.email}</Text>
                        </View>
                    )}
                    <Text>Victim Location: {address}</Text>
                    <Text>ETA Distance: {distance}</Text>
                    <Text>ETA Duration: {duration}</Text>
                </Card>
            )}
        </View>
    )
}