import { ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { getDistanceAndETA } from "../../util/ETA";
import { Card } from "react-native-paper";

export default function RescueTrack({ route }) {
    const { fallResId, isVolunteer, isFamily } = route.params ? route.params : { fallResId: null, isVolunteer: true, isFamily: false };

    const { fbDB } = useContext(FirebaseContext);

    const [fallResData, setFallResData] = useState();
    const [fallData, setFallData] = useState();

    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();

    const [distance1, setDistance1] = useState();
    const [duration1, setDuration1] = useState();


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
                            const snapshotFallData = snapshot.val();
                            if (snapshotFallData) {
                                setFallData({
                                    ...snapshotFallData,
                                    id: snapshotFallResData.fallId
                                })

                                eta = await getDistanceAndETA(snapshotFallData.deviceLat, snapshotFallData.deviceLong)
                                console.log("eta: ", eta)
                                setDuration(eta.duration);
                                setDistance(eta.distance)

                                // @TODO: add address location here
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetch fall res data: ", error);
            }
        }
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
                    <Text></Text>
                </Card>
            )}
        </View>
    )
}