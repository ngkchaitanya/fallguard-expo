import React from "react";
import { Text, View } from "react-native";

export default function UserFamily({ userSentFamily, userReceivedFamily }) {
    console.log("userSentFamily: ", userSentFamily)
    console.log("userReceivedFamily: ", userReceivedFamily)
    return (
        <View>
            <Text>User Family Members goes here</Text>
        </View>
    )
}