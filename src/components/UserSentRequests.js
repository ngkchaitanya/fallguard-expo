import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../css/Global";

export default function UserSentRequests({ sentRequests, sendRequest }) {
    // console.log("UserSentRequests - props: ", props)
    console.log("UserSentRequests: ", sentRequests)
    console.log("-----")
    const [requestEmail, setRequestEmail] = useState("");
    const _onChangeEmail = (val) => {
        setRequestEmail(val)
    }

    const _handleSendRequest = () => {
        console.log("requestEmail: ", requestEmail);
        // handle any validation if required

        sendRequest(requestEmail);
    }

    return (
        <View styles={styles.container}>
            <Text>user sent requests</Text>
            <View>
                <Text>Send Request functionality</Text>
                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={_onChangeEmail}
                        value={requestEmail}
                        placeholder="Email"
                    // keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={_handleSendRequest} style={[styles.button, globalStyles.marT10]}>
                        <Text style={styles.buttonText}>Send Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        //   flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        backgroundColor: 'blue',

    },
    buttonText: {
        color: "#FFF"
    },
    marT10: {
        marginTop: 10
    }
});