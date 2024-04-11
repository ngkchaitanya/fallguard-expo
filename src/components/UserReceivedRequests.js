import React from "react";
import { Text, View } from "react-native";

export default function UserReceivedRequests({ receivedRequests }) {
    console.log("UserReceivedRequests props: ", receivedRequests)
    return (
        <View>
            <Text>UserReceivedRequests</Text>
        </View>
    )
}