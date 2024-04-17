import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { get, push, ref } from 'firebase/database';
import { globalStyles } from '../../css/Global';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../css/theme';
import logo from '../../../assets/fallguardlogo.png';

export default function SignUp({ route, navigation }) {
    const { userType } = route.params;

    const { fbDB } = useContext(FirebaseContext);
    const { loginUser } = useContext(AuthContext);

    const { control, handleSubmit, formState: { errors } } = useForm();

    const [userExists, setUserExists] = useState(false)

    const _onSubmit = async (data) => {
        setUserExists(false);
        const usersRef = ref(fbDB, 'user');
        var userData = {
            ...data,
            email: data.email.toLowerCase(),
            middleName: data.middleName ? data.middleName : null,
            isVolunteer: userType && userType == 'volunteer' ? true : false,
            createdAt: new Date().getTime(),
        }
        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                if (usersData) {
                    for (const [key, item] of Object.entries(usersData)) {
                        if (item.email == userData.email) {
                            setUserExists(true)
                            return;
                        }
                    }
                }
            }
            const newUserRef = await push(usersRef, userData);
            const newUserKey = newUserRef.key;
            loginUser({
                ...userData,
                id: newUserKey,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const _handleLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
             {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
            <Text style={styles.title}>Create Account</Text>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="First Name *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="firstName"
                rules={{
                    required: 'First Name is required',
                }}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

            {/* Middle Name */}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Middle Name"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="middleName"
            />

            {/* Last Name */}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Last Name *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="lastName"
                rules={{
                    required: 'Last Name is required',
                }}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

            {/* Email */}
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

            {/* Phone */}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Phone *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType='number-pad'
                    />
                )}
                name="phone"
                rules={{
                    required: 'Phone is required',
                    pattern: {
                        value: /^\d{10}$/,
                        message: 'Enter a valid 10-digit phone number'
                    }
                }}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

            {/* Password */}
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

            {/* Confirm Password */}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Re-enter Password *"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry
                    />
                )}
                name="confirmPassword"
                rules={{
                    required: 'Re-enter your Password',
                    validate: value => value === control._formValues.password || 'The passwords do not match',
                }}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(_onSubmit)} >
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            {userExists && (
                <View style={styles.userExistsContainer}>
                    <Text style={styles.userExistsText}>A user already exists for this email. Please login using the email.</Text>
                </View>
            )}
            <View style={styles.loginContainer}>
                <Text>Already registered? </Text>
                <TouchableOpacity onPress={_handleLogin}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: theme.colors.secondary,
    },
    logo: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: theme.colors.text,
    },
    input: {
        height: 40,
        borderColor: theme.colors.border,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor:'#FFFFFF',
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginBtnText: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
    button: {
        height: 40,
        width: 150,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: theme.colors.buttonText,
    },
    userExistsContainer: {
        marginTop: 20,
    },
    userExistsText: {
        fontSize: 16,
        color: theme.colors.error,
        textAlign: 'center',
    },
});
