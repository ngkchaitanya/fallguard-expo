import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../css/Global";

export default function Severity({ }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Fall Detected!</Text>
            <Text style={[styles.text, globalStyles.marT10]}>We have detected a Fall. Do you need help?</Text>
            <View style={styles.fallOptionsContainer}>
                <TouchableOpacity>
                    <Text>I can manage. I don't need any help</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>I feel moderate pain. I need help!</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>I'm in extreme pain. I need emergency help!</Text>
                </TouchableOpacity>
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
    fallOptionsContainer: {
        backgroundColor: 'yellow'
    }
});