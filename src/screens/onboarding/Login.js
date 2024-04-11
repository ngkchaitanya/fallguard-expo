import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeA, TouchableOpacityreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { get, push, ref } from 'firebase/database';
import { globalStyles } from '../../css/Global';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login({ navigation }) {
    const { fbDB } = useContext(FirebaseContext);
    const { loginUser } = useContext(AuthContext);

    const { control, handleSubmit, formState: { errors } } = useForm();

    const [newUser, setNewUser] = useState(false)
    const [pageError, setPageError] = useState("");

    const _onSubmit = async (data) => {
        console.log(data);
        setPageError("");

        const usersRef = ref(fbDB, 'user');
        var userData = {
            ...data
        }

        try {
            const snapshot = await get(usersRef);
            console.log("snapshot: ", snapshot)
            if (snapshot.exists()) {
                console.log('Node exists:', snapshot.val());
                // Retrieve users data
                const usersData = snapshot.val();
                for (const [key, item] of Object.entries(usersData)) {
                    console.log('Key:', key);
                    console.log('user:', item);
                    // Check if user email matches
                    if (item.email == userData.email) {
                        console.log("matched!")
                        if (item.password == userData.password) {
                            // login user
                            loginUser({
                                ...item,
                                id: key
                            });
                        } else {
                            setPageError("Password doesn't match")
                        }

                        return;
                    }
                }
            }

            // user doesn't exist
            // try signup
            setPageError("The email is not registerd. Please sign up.")

            // navigate to home
            // adding to auth context, automatically navigates to home
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const _handleSignup = () => {
        navigation.navigate('Entry', {
            // userType: type,
        });
    }

    return (
        <View style={styles.container}>
            <Text>Login</Text>

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Email *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="email"
                rules={{
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email address' }
                }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Password *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry
                    />
                )}
                name="password"
                rules={{
                    required: 'Password is required',
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: 'Password must be at least 8 characters long, include an uppercase letter and a number'
                    }
                }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.signUpBtn} onPress={handleSubmit(_onSubmit)} >
                <Text style={styles.signUpBtnText}>Login</Text>
            </TouchableOpacity>

            {pageError && (
                <View style={styles.userExistsContainer}>
                    <Text style={styles.userExistsText}>{pageError}</Text>
                </View>
            )}

            <View style={styles.loginContainer}>
                <Text>Not registered? </Text>
                <Text onPress={_handleSignup} style={styles.loginBtnText}>Signup</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'yellow'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        width: '100%'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'left',
        width: '100%'
    },
    loginContainer: {
        display: 'flex',
        // backgroundColor: 'blue',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    loginBtnText: {
        textDecorationStyle: 'solid',
        color: 'blue',
        textDecorationLine: 'underline'
    },
    signUpBtn: {
        height: 40,
        width: 150,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    signUpBtnText: {
        color: '#FFF'
    },
    userExistsContainer: {
        // backgroundColor: 'green',
        marginTop: 20,
    },
    userExistsText: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center'
    }
});