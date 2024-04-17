import React from "react";
import { StyleSheet, Text, View,Image } from "react-native";

export default function AppLoading() {
	console.log("In App Loading");
	return (
		<View style={styles.container}>
      <Image source={require('../../assets/fallguardlogo.png')} style={styles.logo} />
      <Text style={styles.appName}>FallGuard</Text>
    </View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff', // Set your background color
	  },
	  logo: {
		width: 500,
		height: 500,
		marginBottom: 1, 
	  },
	  appName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 10,
	  },
});
