import React from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "../css/theme";
import { globalStyles } from "../css/Global";

export default function UserFamily({ userSentFamily, userReceivedFamily }) {
    // console.log("userSentFamily: ", userSentFamily)
    // console.log("userReceivedFamily: ", userReceivedFamily)
    return (
        <View style={[styles.container]}>
            <Text style={{ fontWeight: 'bold', marginTop: 20, color: 'black' }}>Family members</Text>
            <View style={styles.familyMembersContainer}>
                {userSentFamily && userSentFamily.map((request, key) => (
                    <View key={request.id} style={styles.familyMemberCard}>
                        <View style={styles.familyMemberCardData}>
                            {/* <Text>{request.id}</Text> */}
                            {request.familyMember && (
                                <>
                                    {/* <Text>Sent To: {request.familyMember.email}</Text> */}
                                    <Text>{request.familyMember.firstName} {request.familyMember.lastName}</Text>
                                </>
                            )}

                            {/* <Text>Sent At: {request.requestedAt}</Text> */}
                            {/* <Text>Sent At: {new Date(request.requestedAt).toLocaleString()}</Text>
                            <Text>Accepted At: {new Date(request.acceptedAt).toLocaleString()}</Text> */}
                        </View>
                    </View>
                ))}
            </View>
            {/* <Text>Added through received requests:</Text> */}
            <View style={styles.familyMembersContainer}>
                {userReceivedFamily && userReceivedFamily.map((request, key) => (
                     <View key={request.id} style={styles.familyMemberCard}>
                        <View style={styles.familyMemberCardData}>
                            {/* <Text>{request.id}</Text> */}
                            {request.sender && (
                                <>
                                    {/* <Text>Sent By: {request.sender.email}</Text> */}
                                    <Text>{request.sender.firstName} {request.sender.lastName}</Text>
                                    {/* <Text>Sender Last Name: </Text> */}
                                </>
                            )}

                            {/* <Text>Sent At: {request.requestedAt}</Text> */}
                            {/* <Text>Sent At: {new Date(request.requestedAt).toLocaleString()}</Text> */}
                            {/* <Text>Accepted At: {new Date(request.acceptedAt).toLocaleString()}</Text> */}
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
    },
    familyMembersContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        marginTop: 10
    },
    familyMemberCard: {
        backgroundColor: theme.colors.secondary,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        opacity: 0.8
    },
    familyMemberCardData: {
        flex: 2
    },
    familyMemberCardActions: {
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