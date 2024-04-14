import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { FallContext } from "../../contexts/FallContext";

// import {  }

export default function Home() {
    const { resetFallDetection } = useContext(FallContext);

    const { fbDB } = useContext(FirebaseContext);
    const { user, logoutUser } = useContext(AuthContext);

    const _resetFall = () => {
        resetFallDetection();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>

            {user && user.isVolunteer && (
                <View>
                    <Text>Volunteer stuff</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={_resetFall}>
                <Text style={styles.buttonText}>Reset Fall Detection</Text>
            </TouchableOpacity>
        </View>
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 15,
    },
    button: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
    },
    buttonText: {
        color: '#FFF'
    },
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    fallText: {
        textAlign: 'center',
        fontSize: 24,
        color: 'red'
    },
    fallButton: {
        backgroundColor: 'blue',
    },
    fallButtonText: {
        color: "#FFF"
    }
});