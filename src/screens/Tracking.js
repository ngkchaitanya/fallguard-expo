import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { get, push, ref, set, update } from '@firebase/database';
import axios from 'axios';

export default function Tracking() {
    const { fbDB } = useContext(FirebaseContext);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [devices, setDevices] = useState([]);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState("");

    const apiKey = "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s";

    // const _updateLocation = () => {
    //     // Alert.alert('Upload Location?', 'Upload your device current location..', [
    //     //     {
    //     //         text: 'Cancel',
    //     //         onPress: () => console.log('Cancel Pressed'),
    //     //         style: 'cancel',
    //     //     },
    //     //     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     // ]);
    //     // set(ref(fbDB, 'devices'), [...people, textInp]);
    //     var deviceData = {
    //         id: 1,
    //         name: Device.deviceName,
    //         location: {
    //             latitude: location.coords.latitude,
    //             longitude: location.coords.longitude,
    //         }
    //     }

    //     const devicesRef = ref(fbDB, 'devices');
    //     get(devicesRef).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             console.log('Node exists:', snapshot.val());
    //             // check if the device exists
    //             const devicesData = snapshot.val();
    //             var deviceExists

    //             Object.keys(devicesData).forEach((key) => {
    //                 const item = devicesData[key];
    //                 console.log('Key:', key);
    //                 console.log('ID:', item.id);
    //                 console.log('Name:', item.name);
    //                 console.log('Location:', `Latitude: ${item.location.latitude}, Longitude: ${item.location.longitude}`);

    //                 if (item.name == Device.deviceName) {
    //                     console.log("matched! - ", key)
    //                     // Path to the specific item's location in Firebase
    //                     const itemLocationPath = `devices/${key}/location`;

    //                     // Prepare the update object
    //                     const updates = {};
    //                     updates[itemLocationPath + '/latitude'] = location.coords.latitude;
    //                     updates[itemLocationPath + '/longitude'] = location.coords.longitude;

    //                     // Update the data in Firebase
    //                     update(ref(fbDB), updates)
    //                         .then(() => {
    //                             console.log(`Location updated for ${item.name} with key ${key}`)

    //                             return;
    //                         })
    //                         .catch((error) => console.error('Error updating location:', error));

    //                     // write return code here;
    //                 }
    //             });

    //             // continue to adding the device details
    //         } else {
    //             console.log("Before new push")
    //             push(devicesRef, deviceData)
    //                 .then(() => console.log('Node created successfully!'))
    //                 .catch((error) => console.error('Error creating node:', error));
    //         }
    //     })
    // }

    const fetchDevices = async () => {
        console.log("fetch devices --")
        const devicesRef = ref(fbDB, 'devices');
        console.log("ref: ", devicesRef)
        const snapshot = await get(devicesRef);
        console.log("fetch snpashot: ", snapshot)
        if (snapshot.exists()) {
            console.log("snapshot exists")
            updateDeviceFromSnapObject(snapshot.val());
        }
    }

    const _updateLocation = async () => {
        // Define device data
        var deviceData = {
            name: Device.deviceName,
            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }
        }

        // Reference to devices in the database
        const devicesRef = ref(fbDB, 'devices');

        try {
            // Get snapshot of devices
            const snapshot = await get(devicesRef);
            if (snapshot.exists()) {
                console.log('Node exists:', snapshot.val());
                // Retrieve devices data
                const devicesData = snapshot.val();

                // Loop through each device
                for (const [key, item] of Object.entries(devicesData)) {
                    console.log('Key:', key);
                    console.log('ID:', item.id);
                    console.log('Name:', item.name);
                    console.log('Location:', `Latitude: ${item.location.latitude}, Longitude: ${item.location.longitude}`);

                    // Check if device name matches
                    if (item.name == Device.deviceName) {
                        console.log("matched!")
                        // Path to the specific item's location in Firebase
                        const itemLocationPath = `devices/${key}/location`;

                        // Prepare the update object
                        const updates = {};
                        updates[itemLocationPath + '/latitude'] = location.coords.latitude;
                        updates[itemLocationPath + '/longitude'] = location.coords.longitude;

                        // Update the data in Firebase
                        await update(ref(fbDB), updates);
                        console.log(`Location updated for ${item.name} with key ${key}`);

                        fetchDevices();

                        return; // Exit the function after updating
                    }
                }
            }

            console.log("Before push");
            // If device not found, add it to the database
            await push(devicesRef, deviceData);
            console.log('Node created successfully!');

            fetchDevices();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const updateDeviceFromSnapObject = (snapshotObj) => {
        let devicesArray = []
        for (const [key, item] of Object.entries(snapshotObj)) {

            devicesArray.push({
                id: key,
                ...item
            })
        }
        console.log("devicesArray: ", devicesArray);
        setDevices(devicesArray);
    }

    const _trackDevice = (device) => {
        console.log("TracK: target device - ", device.name)

        getDistanceAndETA(originLat = location.coords.latitude, originLng = location.coords.longitude, destinationLat = device.location.latitude, destinationLng = device.location.longitude);
    }

    const getDistanceAndETA = async (originLat, originLng, destinationLat, destinationLng) => {
        const baseUrl = "https://maps.googleapis.com/maps/api/directions/json?";
        const origin = `${originLat},${originLng}`;
        const destination = `${destinationLat},${destinationLng}`;
        const params = {
            "origin": origin,
            "destination": destination,
            "key": apiKey
        };

        try {
            const response = await axios.get(baseUrl, { params });
            const data = response.data;
            console.log("data: ", data)

            if (data.status === "OK") {
                const distance = data.routes[0].legs[0].distance.text;
                const duration = data.routes[0].legs[0].duration.text;
                setDistance(distance);
                setDuration(duration);
            } else {
                setError("Error fetching data");
            }
        } catch (error) {
            console.log('Error:', error.message);
            setError("Error fetching data");
        }
    };

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    useEffect(() => {
        console.log("--first time--")
        fetchDevices();
    }, [])

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>{Device.deviceName}'s Location:</Text>
                {location ? (
                    <>
                        <Text style={styles.paragraph}>Latitude: {location.coords.latitude}</Text>
                        <Text style={styles.paragraph}>Latitude: {location.coords.longitude}</Text>
                        <TouchableOpacity onPress={_updateLocation} style={[styles.button, styles.marT10]}>
                            <Text style={styles.buttonText}>Upload my location</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text>Waiting...</Text>
                )}

            </View>
            <View>
                {error && <Text>{error}</Text>}
                {!error && (distance && duration) && (
                    <View>
                        <Text>Distance: {distance}</Text>
                        <Text>ETA: {duration}</Text>
                    </View>
                )}
            </View>
            <View>
                <Text>Available Devices:</Text>
                {devices && devices.map((device) => (
                    <View key={device.id} style={styles.deviceCard}>
                        <View style={{ flex: 2 }}>
                            <Text>Device: {device.name}</Text>
                            <Text>Lat: {device.location.latitude}</Text>
                            <Text>Long: {device.location.longitude}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => { _trackDevice(device) }}>
                                <Text style={styles.buttonText}>Track</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
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
    },
    deviceCard: {
        backgroundColor: 'yellow',
        marginTop: 10,
        display: 'flex',
        flexDirection: "row",
        padding: 10
    }
});