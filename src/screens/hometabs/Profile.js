import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function Profile() {
    const { user, logoutUser } = useContext(AuthContext);

    const _logout = () => {
        logoutUser();
    }
    return (
        <View>
            <Text>Profile</Text>
            <Text>Id: {user.id}</Text>
            <Text>Email: {user.email}</Text>
            <TouchableOpacity style={{ backgroundColor: 'red', margin: 20 }} onPress={_logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}