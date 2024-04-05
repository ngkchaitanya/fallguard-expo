// Call911Button.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

const Call911Button = () => {
    const handlePress = () => {
        Linking.openURL('tel:911');
      };
    
  return (
    <TouchableOpacity style={styles.callButton} onPress={handlePress}>
      <Text style={styles.buttonText}>Call 911</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  callButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#F44336',
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default Call911Button;
