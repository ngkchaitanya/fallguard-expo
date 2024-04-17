import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../css/Global";
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "../css/theme";

export default function UserSentRequests({ sentRequests, sendRequest }) {
    // console.log("UserSentRequests - props: ", props)
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    // console.log("UserSentRequests: ", sentRequests)
    // console.log("-----")


    const _onSubmit = (data) => {
        // console.log("requestEmail in child file: ", data.email);
        // handle any validation if required

        sendRequest(data.email.toLowerCase());

        reset();
    }



    return (
        <View style={[styles.container, globalStyles.marT30]}>

            <View style={styles.sendRequestContainer}>
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

               
            </View>
            <TouchableOpacity style={[styles.button, globalStyles.marT10]} onPress={handleSubmit(_onSubmit)} >
                    <Text style={styles.buttonText}>Add Family Member</Text>
                </TouchableOpacity>

            {sentRequests.length>0 && (<Text style={{ fontWeight: 'bold', marginTop: 20, color: 'black' }}>Pending user sent requests:</Text>)}

            {sentRequests.length>0 && (<View style={styles.sentRequestsContainer}>

                {sentRequests.map((request, key) => (
                    <View key={request.id} style={styles.sentRequestCard}>
                        <View style={styles.sentRequestCardData}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ width: 150, color:"#FFFFFF"}}>{request.familyMemberEmail}</Text>
                            <Text style={{ flex: 1, textAlign: 'right',color:"#FFFFFF" }}> {new Date(request.requestedAt).toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: "#FFFFFF",
        // padding: 20,
        // margin: 20,
        // width: '100%'
    },
    text: {
        textAlign: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        marginVertical: 8, // Added vertical margin
        marginHorizontal: 12, // Added horizontal margin
        borderWidth: 1,
        padding: 10,
        backgroundColor:"#FFFFFF",
         // Rounded corners for the button

    },
    button: {
        //   flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        backgroundColor: theme.colors.secondary,
        borderRadius: 10, // Rounded corners for the button


    },
    buttonText: {
        color: "#000000"
    },
    marT10: {
        marginTop: 10
    },
    sendRequestContainer: {
        backgroundColor: theme.colors.primary,
        width: '100%',
        borderRadius: 10,
    },
    sentRequestsContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        marginTop: 20
    },
    sentRequestCard: {
        backgroundColor: 'purple',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        opacity: 1
    },
    sendRequestErrorText: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
        marginTop: 10
    },
    sentRequestCardData: {
        flex: 2
    },
    sentRequestCardActions: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    requestActionBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: theme.colors.secondary,
        // borderRadius: 100
    },
    requestAcceptActionBtn: {
        backgroundColor: 'blue',
    },
    requestRejectActionBtn: {
        backgroundColor: "#FE927B"
    },
    requestActionBtnText: {
        color: '#FFF'
    }
});