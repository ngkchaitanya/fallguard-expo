import React, { createContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
    const [fbApp, setFbApp] = useState(null);
    const [fbDB, setFbDB] = useState();

    const firebaseConfig = {
        apiKey: "AIzaSyAdj-FlfzzCQKaGzzyZCvUqIh0QxIoTn_s",
        authDomain: "fallguard-77141.firebaseapp.com",
        projectId: "fallguard-77141",
        storageBucket: "fallguard-77141.appspot.com",
        messagingSenderId: "423413606526",
        appId: "1:423413606526:web:e416f69c62001194dc102f",
        measurementId: "G-6Z3CSZMD1H",
        databaseURL: "https://fallguard-77141-default-rtdb.firebaseio.com/",
    };

    useEffect(() => {
        console.log("in use efffect")
        if (fbApp) {
            console.log("app exists")
            if (fbDB) {
                console.log("DB exists")
                // do nothing
            } else {
                console.log("DB NOT exists")
                var db = getDatabase(app);

                setFbDB(db);
            }
        } else {
            console.log("app NOT exists")
            var app = (initializeApp(firebaseConfig));

            setFbApp(app);
        }
    }, [fbApp, fbDB])

    // useEffect(() => {
    //     console.log("fbApp: ", fbApp)
    //     if (fbApp) {

    //     }
    // }, [fbApp])

    return (
        <FirebaseContext.Provider value={{ fbApp, fbDB }}>
            {children}
        </FirebaseContext.Provider>
    );
};