import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home({ navigation }) {
    const _openFallDetection = () => {
        navigation.navigate('Fall')
    }

    const _openEntry = () => {
        navigation.navigate('Entry')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <TouchableOpacity onPress={_openFallDetection} style={[styles.button, styles.marT10]}>
                <Text style={styles.buttonText}>Open Fall Detection</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={_openEntry} style={[styles.button, styles.marT10]}>
                <Text style={styles.buttonText}>Open Entry Screens</Text>
            </TouchableOpacity>
        </View>
    );
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
