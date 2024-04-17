import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { get, push, ref } from 'firebase/database';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../css/theme'; // Import your theme

export default function Login({ navigation }) {
  const { fbDB } = useContext(FirebaseContext);
  const { loginUser } = useContext(AuthContext);

  const { control, handleSubmit, formState: { errors } } = useForm();

  const [newUser, setNewUser] = useState(false)
  const [pageError, setPageError] = useState("");

  const _onSubmit = async (data) => {
    console.log(data);
    setPageError("");

    data.email = data.email.toLowerCase();

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
        if (userData) {
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
      }

      // user doesn't exist
      // try signup
      setPageError("The email is not registered. Please sign up.")

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
    <View style={[styles.container]}>
      <Text style={[styles.title]}>Login</Text>

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
      {errors.email && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.email.message}</Text>}

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
      {errors.password && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSubmit(_onSubmit)} >
        <Text style={styles.signUpBtnText}>Login</Text>
      </TouchableOpacity>

      {pageError && (
        <View style={styles.userExistsContainer}>
          <Text style={[styles.userExistsText, { color: theme.colors.error }]}>{pageError}</Text>
        </View>
      )}

      <View style={styles.loginContainer}>
        <Text style={{ color: theme.colors.text }}>Not registered? </Text>
        <Text onPress={_handleSignup} style={[styles.loginBtnText, { color: theme.colors.primary }]}>Signup</Text>
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
    backgroundColor: theme.colors.secondary,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.colors.text,
},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: '100%',
    backgroundColor:'#FFFFFF'
  },
  errorText: {
    marginBottom: 10,
    textAlign: 'left',
    width: '100%'
  },
  loginContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  loginBtnText: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline'
  },
  signUpBtn: {
    height: 40,
    width: 150,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  signUpBtnText: {
    color: '#FFF'
  },
  userExistsContainer: {
    marginTop: 20,
  },
  userExistsText: {
    fontSize: 20,
    textAlign: 'center'
  }
});
