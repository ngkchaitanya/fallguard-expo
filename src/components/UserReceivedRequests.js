import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "../css/theme";


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
            <Text style={{ fontWeight: 'bold', marginTop: 20, color: 'black' }}>Received Requests:</Text>
            <View style={styles.receivedRequestsContainer}>
                {receivedRequests && receivedRequests.map((request, key) => (
                    <View key={request.id} style={styles.receivedRequestCard}>
                        <View style={styles.receivedRequestCardData}>
                            {request.sender && (
                                <>
                                    {/* <Text>Sent By: {request.sender.email}</Text> */}
                                    <Text>{request.sender.firstName} {request.sender.lastName}</Text>
                                </>
                            )}

                            {/* <Text>Sent At: {request.requestedAt}</Text> */}
                            <Text>On: {new Date(request.requestedAt).toLocaleString()}</Text>
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
        backgroundColor: '#FFFFFF',
    },
    receivedRequestsContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        marginTop: 20
    },
    receivedRequestCard: {
        backgroundColor: theme.colors.secondary,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        opacity: 0.8
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
        backgroundColor: theme.colors.primary,
    },
    requestRejectActionBtn: {
        backgroundColor: "#F7260c"
    },
    requestActionBtnText: {
        color: '#FFF'
    }
});