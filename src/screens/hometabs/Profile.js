import React, { useContext } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Import Feather icons (you can choose any icon library)
import theme from "../../css/theme";

export default function Profile() {
    const { user, logoutUser } = useContext(AuthContext);

    const _logout = () => {
        logoutUser();
    }

    return (
        <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>User Profile</Text>
                <View style={styles.profileInfo}>
                    <View style={styles.infoItem}>
                        <Feather name="user" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.infoText}>Name: {user.firstName} {user.lastName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Feather name="mail" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.infoText}>Email: {user.email}</Text>
                    </View>
                    {/* <Text>Volunteer: {user.isVolunteer ? "True" : "False"}</Text> */}
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={_logout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    infoText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 35,
    },
    logoutButton: {
        backgroundColor: '#fff', // Change color to white for contrast
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        elevation: 5, // Add elevation for shadow
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: theme.colors.primary, // Change text color to primary theme color
        textAlign: 'center',
    },
    icon: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
});
