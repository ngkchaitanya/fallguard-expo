import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

import { globalStyles } from '../../css/Global';

export default function Entry({ navigation }) {
	const { loginUser, logoutUser } = useContext(AuthContext);
	console.log("In Entry");

	const handleLoadUser = () => {
		loginUser({
			id: "asase",
			name: "NGK"
		});
	}

	const _userLogin = () => {
		// navigate to login page
		console.log("login")

		navigation.navigate('Login', {
			// userType: type,
		});
	}

	const _userSignUp = (type) => {
		// navigate to signup page with type prop
		console.log("type: ", type);

		navigation.navigate('SignUp', {
			userType: type,
		});
	}

	return (
		<View style={styles.container}>
			<View style={styles.c1}>
				<Text>Entry Screen</Text>
				<View style={styles.actionsContainer}>
					<Text>Signup Options:</Text>
					<TouchableOpacity style={styles.button} onPress={() => { _userSignUp("normal") }}>
						<Text style={styles.buttonText}>Signup As User</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, globalStyles.marT10]} onPress={() => { _userSignUp("family") }}>
						<Text style={styles.buttonText}>Signup As Family Member</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, globalStyles.marT10]} onPress={() => { _userSignUp("volunteer") }}>
						<Text style={styles.buttonText}>Signup As Volunteer</Text>
					</TouchableOpacity>
				</View>
				<View style={[styles.actionsContainer, globalStyles.marT30]}>
					<Text>Already signed up? Login here:</Text>
					<TouchableOpacity style={styles.button} onPress={_userLogin}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
				</View>
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
	actionsContainer: {
		backgroundColor: 'yellow',
		width: '100%',
		paddingHorizontal: 20
	},
	button: {
		//   flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#eee',
		padding: 10,
		backgroundColor: 'blue',
		// width: 'auto'
	},
	buttonText: {
		color: "#FFF"
	},
});