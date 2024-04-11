import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const logoutUser = async () => {
        try {
            await AsyncStorage.removeItem('user')

            setUser(null);
        } catch (error) {
            console.error("Error while trying to remove user: ", error);
        }

    }

    const loginUser = async (user) => {
        try {
            const jsonValue = JSON.stringify(user)
            await AsyncStorage.setItem('user', jsonValue)

            setUser(user)
        } catch (error) {
            console.error("Error while trying to store user: ", error);
        }
    }

    useEffect(() => {
        // check if user already exists in storage
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user');
                console.log("get user json value: ", jsonValue)
                if (jsonValue != null) {
                    setUser(JSON.parse(jsonValue));

                    // @TODO: store only if this matched with any of the users in the DB
                }
            } catch (e) {
                // error reading value
                console.error("Error while trying to get stored user: ", e);
            }
        };

        getData();
    }, [])

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
