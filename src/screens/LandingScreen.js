// // components/LandingScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { Asset } from 'expo-asset';

// const LandingScreen = ({ navigation }) => {
//   useEffect(() => {
//     // Load the logo asset
//     const loadAssets = async () => {
//       await Asset.loadAsync(require('../../assets/fallguardlogo.png'));
//       // Navigate to entry screen after 1 second
//       setTimeout(() => {
//         navigation.navigate('Entry');
//       }, 1000);
//     };
//     loadAssets();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image source={require('../../assets/fallguardlogo.png')} style={styles.logo} />
//       <Text style={styles.appName}>FallGuard</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff', // Set your background color
//   },
//   logo: {
//     width: 500,
//     height: 500,
//     marginBottom: 1, 
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
// });

// export default LandingScreen;
