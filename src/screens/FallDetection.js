import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';

export default function FallDetection() {
  const [accData, setAccData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyroData, setGyroData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [fallDetected, setFallDetected] = useState(false);
  const [isFall, setIsFall] = useState(0);

  const [accSubscription, setAccSubscription] = useState(null);
  const [gyroSubscription, setGyroSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000)
    Gyroscope.setUpdateInterval(1000)
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16)
    Gyroscope.setUpdateInterval(16)
  };

  const fallThreshold = 2;
  const orientationThreshold = 1.5;
  const AGVeSRThreshold = 30; // Combined magnitude of Accelerometer and Gyroscope
  const AlimThreshold = 30; // Acceleration magnitude threshold
  const AlphaThreshold = 65; // Tilt angle threshold
  const GyroReDiThreshold = 50; // Gyroscope magnitude threshold
  const AGPeakAccelThreshold = 40; // Peak Accelerometer magnitude threshold
  const AGPeakGyroThreshold = 40; // Peak Gyroscope magnitude threshold
  

  const _subscribe = () => {
    console.log("--- Subscription ---")
    setFallDetected(false);
    
    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);

    setAccSubscription(
      Accelerometer.addListener(AccelerometerData => {
        setAccData(AccelerometerData);
      })
    );

    setGyroSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setGyroData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    console.log("--- Unsubscription ---")
    accSubscription && accSubscription.remove();
    gyroSubscription && gyroSubscription.remove();

    setAccSubscription(null);
    setGyroSubscription(null);
  };

  useEffect(() => {
    console.log("--- Initial Subscription UseEffect ---")
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (!fallDetected) {
      console.log("--- Fall Check UseEffect ---")
      
      const accelMagnitude = Math.sqrt(accData.x ** 2 + accData.y ** 2 + accData.z ** 2);
      const gyroMagnitude = Math.sqrt(gyroData.x ** 2 + gyroData.y ** 2 + gyroData.z ** 2);
      if(accelMagnitude + gyroMagnitude > AGVeSRThreshold){
        setIsFall(prevCount => prevCount + 1);
      }
      const magnitude = Math.sqrt(accData.x ** 2 + accData.y ** 2 + accData.z ** 2);
      if( magnitude > AlimThreshold)  setIsFall(prevCount => prevCount + 1);
       
      // const tiltAngle = Math.atan2(accData.y, accData.z) * (180 / Math.PI);
      // if(Math.abs(tiltAngle) > AlphaThreshold)  setIsFall(prevCount => prevCount + 1);

      const mag = Math.sqrt(gyroData.x ** 2 + gyroData.y ** 2 + gyroData.z ** 2);
      if(mag > GyroReDiThreshold)  setIsFall(prevCount => prevCount + 1);

      const accelMag = Math.sqrt(accData.x ** 2 + accData.y ** 2 + accData.z ** 2);
      const gyroMag = Math.sqrt(gyroData.x ** 2 + gyroData.y ** 2 + gyroData.z ** 2);
      if(accelMag > AGPeakAccelThreshold && gyroMag > AGPeakGyroThreshold)  setIsFall(prevCount => prevCount + 1);

      if(isFall>=3){
        
          // fallDetected = true;
          console.log('@@@ Fall detected!');
          setFallDetected(true);
          _unsubscribe();
        
      }
    }
  }, [accData, gyroData, fallDetected])


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer:</Text>
      <Text style={styles.text}>x: {accData.x}</Text>
      <Text style={styles.text}>y: {accData.y}</Text>
      <Text style={styles.text}>z: {accData.z}</Text>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>x: {gyroData.x}</Text>
      <Text style={styles.text}>y: {gyroData.y}</Text>
      <Text style={styles.text}>z: {gyroData.z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={accSubscription && gyroSubscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{accSubscription && gyroSubscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
      {fallDetected && (
        <>
          <Text style={styles.fallText}>Fall Detected!!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity  onPress={() => {
    setFallDetected(false); // Reset fall detection
    setIsFall(0);
    _subscribe(); // Re-subscribe to sensor data
}} style={[styles.button, styles.fallButton]}>
              <Text style={[styles.text, styles.fallButtonText]}>Resume Detection</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
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
