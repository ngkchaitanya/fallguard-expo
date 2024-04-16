import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../css/theme';
import { globalStyles } from '../../css/Global';

export default function Entry({ navigation }) {
    const { loginUser, logoutUser } = useContext(AuthContext);

    const handleLoadUser = () => {
        loginUser({
            id: "asase",
            name: "NGK"
        });
    }

    const _userLogin = () => {
        navigation.navigate('Login');
    }

    const _userSignUp = (type) => {
        navigation.navigate('SignUp', {
            userType: type,
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.actionsContainer}>
                
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
                <Text style={styles.subtitle}>Already signed up? Login here:</Text>
                <TouchableOpacity style={styles.button} onPress={_userLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.secondary,
    },
    actionsContainer: {
        backgroundColor: '#FFFFFF',
        width: "80%",
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        opacity: 0.9, // Adjust opacity for a polished look
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 10,
        color: theme.colors.secondary,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
