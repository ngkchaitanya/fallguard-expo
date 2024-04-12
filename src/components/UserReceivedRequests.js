import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function UserReceivedRequests({ receivedRequests, accpetRequest, rejectRequest }) {
    // console.log("UserReceivedRequests props: ", receivedRequests)
    const _handleAccept = (requestId) => {
        console.log("local accept request: ", requestId);

        accpetRequest(requestId);
    }

    const _handleReject = (requestId) => {
        console.log("local reject request: ", requestId);

        rejectRequest(requestId)
    }

    return (
        <View style={styles.container}>
            <Text>User Received Requests</Text>
            <View style={styles.receivedRequestsContainer}>
                {receivedRequests && receivedRequests.map((request, key) => (
                    <View key={request.id} style={styles.receivedRequestCard}>
                        <View style={styles.receivedRequestCardData}>
                            <Text>{request.id}</Text>
                            {request.sender && (
                                <>
                                    <Text>Sent By: {request.sender.email}</Text>
                                    <Text>Sender First Name: {request.sender.firstName}</Text>
                                    <Text>Sender Last Name: {request.sender.lastName}</Text>
                                </>
                            )}

                            {/* <Text>Sent At: {request.requestedAt}</Text> */}
                            <Text>Sent At: {new Date(request.requestedAt).toLocaleString()}</Text>
                        </View>
                        <View style={styles.receivedRequestCardActions}>
                            <TouchableOpacity style={[styles.requestActionBtn, styles.requestAcceptActionBtn]}
                                onPress={() => _handleAccept(request.id)}>
                                <MaterialCommunityIcons name="check" size={20} color={"#FFF"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.requestActionBtn, styles.requestRejectActionBtn]}
                                onPress={() => _handleReject(request.id)}>
                                <MaterialCommunityIcons name="close" size={20} color={"#FFF"} />
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'green',
    },
    receivedRequestsContainer: {
        backgroundColor: 'green',
        width: '100%',
        marginTop: 20
    },
    receivedRequestCard: {
        backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10
    },
    receivedRequestCardData: {
        flex: 2
    },
    receivedRequestCardActions: {
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