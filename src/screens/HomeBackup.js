import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// import { database } from '../firebaseConfig';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { onValue, ref, set } from 'firebase/database';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeBackup({ navigation }) {
    const { fbDB } = useContext(FirebaseContext);
    const { logoutUser } = useContext(AuthContext);

    const [people, setPeople] = useState([]);
    const [textInp, setTextInp] = useState(null);

    const _openFallDetection = () => {
        navigation.navigate('Fall')
    }

    const _openEntry = () => {
        navigation.navigate('Entry')
    }

    const _onChangeInput = (val) => {
        console.log("text inp: ", val)
        setTextInp(val);
    }

    const _enterName = () => {
        set(ref(fbDB, 'test'), [...people, textInp]
        );
    }

    const _openTracking = () => {
        navigation.navigate('Track')
    }

    const _removeUser = () => {
        logoutUser();
    }

    useEffect(() => {
        // show loading until all the things are loaded
        console.log("---------")

        const starCountRef = ref(fbDB, 'test');
        console.log("starCountRef: ", starCountRef)
        onValue(starCountRef, (snapshot) => {
            var data = snapshot.val();
            console.log("data: ", data)

            setPeople(data);
        });
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <TouchableOpacity onPress={_openFallDetection} style={[styles.button, styles.marT10]}>
                <Text style={styles.buttonText}>Open Fall Detection</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={_openEntry} style={[styles.button, styles.marT10]}>
                <Text style={styles.buttonText}>Open Entry Screens</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={_openTracking} style={[styles.button, styles.marT10]}>
                <Text style={styles.buttonText}>Open Tracking Screen</Text>
            </TouchableOpacity>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={_onChangeInput}
                    value={textInp}
                    placeholder="useless placeholder"
                // keyboardType="numeric"
                />
                <TouchableOpacity onPress={_enterName} style={[styles.button, styles.marT10]}>
                    <Text style={styles.buttonText}>Enter Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.marT10]} onPress={_removeUser}>
                    <Text style={styles.buttonText}>Logout User</Text>
                </TouchableOpacity>
            </View>
            <View>
                {people && people.map((name) => (
                    <Text key={name}>{name}</Text>
                ))}
            </View>
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    paragraph: {
        fontSize: 18,
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
