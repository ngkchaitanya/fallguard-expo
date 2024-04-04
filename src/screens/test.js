const axios = require('axios');

async function getDistanceAndETA(apiKey, originLat, originLng, destinationLat, destinationLng) {
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

        if (data.status === "OK") {
            const distance = data.routes[0].legs[0].distance.text;
            const duration = data.routes[0].legs[0].duration.text;
            return { distance, duration };
        } else {
            return { distance: "Error", duration: "Error" };
        }
    } catch (error) {
        console.error('Error:', error.message);
        return { distance: "Error", duration: "Error" };
    }
}

// Example Usage
const apiKey = "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s";
const originLat = 37.7749;
const originLng = -122.4194;
const destinationLat = 34.0522;
const destinationLng = -118.2437;

getDistanceAndETA(apiKey, originLat, originLng, destinationLat, destinationLng)
    .then(({ distance, duration }) => {
        console.log("Distance:", distance);
        console.log("ETA:", duration);
    });
