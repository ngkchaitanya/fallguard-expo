import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../css/theme';
import { useNavigation } from '@react-navigation/native';


const Tips = () => {
    const navigation = useNavigation();

    const handleCloseTips = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Volunteer Tips</Text>
                <View style={styles.tipsContainer}>
                    <View style={styles.tipBlock}>
                        <Text style={styles.tip}>1. Stay calm and assess the situation.</Text>
                    </View>
                    <View style={styles.tipBlock}>
                        <Text style={styles.tip}>2. Communicate with the victim to reassure them.</Text>
                    </View>
                    <View style={styles.tipBlock}>
                        <Text style={styles.tip}>3. Call emergency services if necessary.</Text>
                    </View>
                    <View style={styles.tipBlock}>
                        <Text style={styles.tip}>4. Follow any instructions provided by emergency services.</Text>
                    </View>
                    <View style={styles.tipBlock}>
                        <Text style={styles.tip}>5. Document any relevant information about the fall.</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleCloseTips}>
                    <Text style={styles.buttonText}>Close Tips</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        borderRadius: 20,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    tipsContainer: {
        marginBottom: 20,
    },
    tipBlock: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    tip: {
        fontSize: 18,
        color: '#000',
    },
    button: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Tips;
