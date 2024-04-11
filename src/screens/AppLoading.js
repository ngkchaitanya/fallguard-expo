import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AppLoading() {
	console.log("In App Loading");
	return (
		<View style={styles.container}>
			<View style={styles.c1}>
				<Text>App Loading Screen</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 10,
	},
	c1: {
		backgroundColor: "red",
		alignItems: "center",
	},
});
