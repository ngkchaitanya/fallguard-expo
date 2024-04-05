import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import Call911Button from './Call911Button';



export default function Severity() {
    return (
      <View style={styles.container}> 
        <Text style={styles.question}>How severe is your fall?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button,{ backgroundColor: '#BB9E07' }]}>
            <Text style={styles.buttonText}>I can manage. I don't need any help.</Text>
          </TouchableOpacity>
          <View style={{marginBottom: 10}} />
          <TouchableOpacity style={[styles.button,{ backgroundColor: '#CB6D29' }]}>
            <Text style={styles.buttonText}>I feel moderate pain and discomfort. I need help!</Text>
          </TouchableOpacity>
          <View style={{marginBottom: 10}} />
          <TouchableOpacity style={[styles.button,{ backgroundColor: '#9C0606' }]}>
            <Text style={styles.buttonText}>I am in extreme pain. I need emergency help!</Text>
          </TouchableOpacity>
          <View style={{marginBottom: 10}} />
        </View>
        <Call911Button />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    question: {
      fontSize: 20,
      marginBottom: 20,
    },
    buttonContainer: {
      marginBottom: 20,
    },
    button: {
      backgroundColor: 'lightblue',
      width: 380,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
    },
    callButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#F44336',
        width: 380,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
  });