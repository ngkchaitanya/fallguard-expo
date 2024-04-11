import React, { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";

export default function Home() {
    const { fbDB } = useContext(FirebaseContext);
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <View>
            <Text>Home</Text>

            {user && user.isVolunteer && (
                <View>
                    <Text>Volunteer stuff</Text>
                </View>
            )}
        </View>
    )
}