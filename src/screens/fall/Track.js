import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FallContext } from "../../contexts/FallContext";
import { ref } from "firebase/database";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { Button } from "react-native-paper";
// import { Text } from "react-native-paper";

export default function Track({ route, navigation }) {
    const { fallId, isEmergency } = route.params ? route.params : { fallId: null, isEmergency: false };

    const { fbDB } = useContext(FirebaseContext);
    const { currentFallId, removeFall } = useContext(FallContext);

    const [fallData, setFallData] = useState();

    useEffect(() => {
        console.log("currentFallId: ", currentFallId);
        console.log("fallId: ", fallId);
        var localFallId = currentFallId ? currentFallId : (fallId ? fallId : null);
        if (localFallId) {
            console.log("fallId - Track: ", localFallId);
            // get data here
            const fallRef = ref(fbDB, 'fall/', localFallId)

            // emergency
            if (isEmergency) {
                // TODO: open the 911 page
            }
        }
    }, [])

    return (
        <View>
            <Text>Track</Text>
            <Button onPress={() => removeFall()}>
                Remove Fall
            </Button>
        </View>
    )
}