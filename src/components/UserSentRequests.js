import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../css/Global";
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

                <TouchableOpacity style={[styles.button, globalStyles.marT10]} onPress={handleSubmit(_onSubmit)} >
                    <Text style={styles.buttonText}>Send Request</Text>
                </TouchableOpacity>
            </View>

            <Text style={globalStyles.marT20}>Pending user sent requests:</Text>
            <View style={styles.sentRequestsContainer}>
                {sentRequests.map((request, key) => (
                    <View key={request.id} style={styles.sentRequestCard}>
                        <View style={styles.sentRequestCardData}>
                            <Text>{request.id}</Text>
                            <Text>Sent To: {request.familyMemberEmail}</Text>
                            {/* <Text>Sent At: {request.requestedAt}</Text> */}
                            <Text>Sent At: {new Date(request.requestedAt).toLocaleString()}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'green',
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
        borderWidth: 1,
        padding: 10,
    },
    button: {
        //   flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        backgroundColor: 'blue',

    },
    buttonText: {
        color: "#FFF"
    },
    marT10: {
        marginTop: 10
    },
    sendRequestContainer: {
        backgroundColor: 'orange',
        width: '100%'
    },
    sentRequestsContainer: {
        backgroundColor: 'green',
        width: '100%',
        marginTop: 20
    },
    sentRequestCard: {
        backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10
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
        backgroundColor: 'blue',
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