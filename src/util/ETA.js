import React from "react";
import * as Location from 'expo-location';
import axios from 'axios';

export const getDistanceAndETA = async (destinationLat, destinationLng) => {
    const apiKey = "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s";
    let location = await Location.getCurrentPositionAsync({});
    // console.log("LOCATION: ", location)

    let originLat = location.coords.latitude
    let originLng = location.coords.longitude

    const baseUrl = "https://maps.googleapis.com/maps/api/directions/json?";
    const origin = `${originLat},${originLng}`;
    const destination = `${destinationLat},${destinationLng}`;
    const params = {
        "origin": origin,
        "destination": destination,
        "key": apiKey
    };
    console.log("params: ", params);

    try {
        const response = await axios.get(baseUrl, { params });
        const data = response.data;
        console.log("data: ", data)

        if (data.status === "OK") {
            const distance = data.routes[0].legs[0].distance.text;
            const duration = data.routes[0].legs[0].duration.text;

            console.log("inside distance: ", distance)
            console.log("inside duration: ", duration)

            return {
                distance,
                duration,
                userLat: originLat,
                userLong: originLng
            }

        } else {
            setError("Error fetching data");
        }
    } catch (error) {
        console.log('Error:', error.message);
        setError("Error fetching data");
    }
};

export const getLocationAddress = async (lat, long) => {
    const apiKey = "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s";

    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
    const latlng = `${lat},${long}`;
    const params = {
        "latlng": latlng,
        "key": apiKey
    };
    console.log("geocode params: ", params);

    try {
        const response = await axios.get(baseUrl, { params });
        const data = response.data;
        // console.log("data: ", data)

        if (data.status === "OK") {
            console.log("Geocoding data: ", data)
            const address = data.results[0].formatted_address
            console.log("address: ", address)

            // console.log("inside distance: ", distance)
            // console.log("inside duration: ", duration)

            // return {
            //     distance,
            //     duration,
            //     userLat: originLat,
            //     userLong: originLng
            // }
            return {
                address
            }

        } else {
            setError("Error fetching data");
        }
    } catch (error) {
        console.log('Error:', error.message);
        setError("Error fetching data");
    }
}

export const getDistAndETABetweenUsers = async (originLat, originLng, destinationLat, destinationLng) => {
    const apiKey = "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s";

    const baseUrl = "https://maps.googleapis.com/maps/api/directions/json?";
    const origin = `${originLat},${originLng}`;
    const destination = `${destinationLat},${destinationLng}`;
    const params = {
        "origin": origin,
        "destination": destination,
        "key": apiKey
    };
    console.log("bw users - params: ", params);

    try {
        const response = await axios.get(baseUrl, { params });
        const data = response.data;
        console.log("data: ", data)

        if (data.status === "OK") {
            const distance = data.routes[0].legs[0].distance.text;
            const duration = data.routes[0].legs[0].duration.text;

            console.log("inside distance: ", distance)
            console.log("inside duration: ", duration)

            return {
                distance,
                duration,
            }

        } else {
            setError("Error fetching data");
        }
    } catch (error) {
        console.log('Error:', error.message);
        setError("Error fetching data");
    }
}