import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
//import Severity from './Severity';

const FallDetected = ({ navigation }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleYes = () => {
    // Navigate to severity page
    navigation.navigate('Severity');
  };

  const handleNo = () => {
    // Navigate back to home page
    navigation.goBack();
  };

  useEffect(() => {
    if (timer === 0) {
      // Navigate to volunteer screen
     // navigation.navigate('FamilyAndVolunteerScreen');
    }
  }, [timer]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>We detected a fall. Did you fall?</Text>
      <View style={{ flexDirection: 'row' , justifyContent: 'space-between', width: '30%' }}>
      <TouchableOpacity style={{ padding: 10, backgroundColor: 'green', marginBottom: 10 }} onPress={handleYes}>
        <Text style={{ fontSize: 20, color: 'white' }}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', marginBottom: 10 }} onPress={handleNo}>
        <Text style={{ fontSize: 20, color: 'white' }}>No</Text>
      </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 18, marginTop: 20 }}>Time left: {timer} seconds</Text>
    </View>
  );
};

export default FallDetected;
