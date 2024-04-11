import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeA, TouchableOpacityreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { get, push, ref } from 'firebase/database';
import { globalStyles } from '../../css/Global';
import { AuthContext } from '../../contexts/AuthContext';

export default function SignUp({ route, navigation }) {
    const { userType } = route.params;

    const { fbDB } = useContext(FirebaseContext);
    const { loginUser } = useContext(AuthContext);

    const { control, handleSubmit, formState: { errors } } = useForm();

    const [userExists, setUserExists] = useState(false)

    const _onSubmit = async (data) => {
        console.log(data); // You can replace this with your signup logic
        setUserExists(false);
        const usersRef = ref(fbDB, 'user');
        var userData = {
            ...data,
            middleName: data.middleName ? data.middleName : null,
            isVolunteer: userType && userType == 'volunteer' ? true : false,
            createdAt: new Date().getTime(),
        }
        // check if an account already exists with the email
        try {
            const snapshot = await get(usersRef);
            console.log("snapshot: ", snapshot)
            if (snapshot.exists()) {
                console.log('Node exists:', snapshot.val());
                // Retrieve users data
                const usersData = snapshot.val();
                if (usersData) {
                    for (const [key, item] of Object.entries(usersData)) {
                        console.log('Key:', key);
                        console.log('user:', item);
                        // Check if user email matches
                        if (item.email == userData.email) {
                            console.log("matched!")
                            // user exists
                            // show error and ask to login
                            setUserExists(true)

                            return;
                        }
                    }
                }

            }

            console.log("Before push");
            // If user not found, add it to the database
            const newUserRef = await push(usersRef, userData);
            const newUserKey = newUserRef.key;
            console.log("new User: ", newUserKey);
            console.log('Node created successfully!');

            // update auth context
            loginUser({
                ...userData,
                id: newUserRef,
            });

            // navigate to home
            // adding to auth context, automatically navigates to home
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const _handleLogin = () => {
        navigation.navigate('Login', {
            // userType: type,
        });
    }

    return (
        <View style={styles.container}>
            <Text>Signup</Text>
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
                rules={{}}
            />
            {/* {errors.middleName && <Text style={styles.errorText}>{errors.middleName.message}</Text>} */}

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

            <TouchableOpacity style={styles.signUpBtn} onPress={handleSubmit(_onSubmit)} >
                <Text style={styles.signUpBtnText}>Signup</Text>
            </TouchableOpacity>

            {userExists && (
                <View style={styles.userExistsContainer}>
                    <Text style={styles.userExistsText}>A user already exists for this email. Please login using the email.</Text>
                </View>
            )}
            <View style={styles.loginContainer}>
                <Text>Already registered? </Text>
                <Text onPress={_handleLogin} style={styles.loginBtnText}>Login</Text>
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