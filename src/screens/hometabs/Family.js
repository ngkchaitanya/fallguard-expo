import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { AuthContext } from "../../contexts/AuthContext";
import { onValue, ref } from "firebase/database";
import UserReceivedRequests from "../../components/UserReceivedRequests";
import UserSentRequests from "../../components/UserSentRequests";
import UserFamily from "../../components/UserFamily";

export default function Family() {
    const { fbDB } = useContext(FirebaseContext);
    const { user } = useContext(AuthContext);

    const [requestsToUser, setRequestsToUser] = useState([]);
    const [userSentRequests, setUserSentRequests] = useState([]);
    const [userSentFamily, setUserSentFamily] = useState([]);
    const [userReceivedFamily, setUserReceivedFamily] = useState([]);

    const _sendRequest = () => {
        console.log("send request in family")
    }

    useEffect(() => {
        const checkUserFamily = async () => {
            const userFamilyRef = ref(fbDB, 'user_family');
            console.log("userFamilyRef: ", userFamilyRef)

            try {
                onValue(userFamilyRef, (snapshot) => {
                    var userFamilyData = snapshot.val();
                    console.log("userFamilyData: ", userFamilyData)

                    var requestsToUserArray = [];
                    var userSentRequestsArray = [];
                    var userSentFamilyArray = [];
                    var userReceivedFamilyArray = [];

                    if (userFamilyData) {
                        for (const [key, item] of Object.entries(userFamilyData)) {
                            console.log("item: ", item)
                            if (item.userId == user.id) {
                                // user related
                                // user has sent requests
                                if (item.acceptedAt) {
                                    // family member has accepted the user's request
                                    // add to user family
                                    userSentFamilyArray.push({
                                        ...item,
                                        id: key
                                    })
                                } else if (!item.rejectedAt) {
                                    // request sent by user is prending
                                    userSentRequestsArray({
                                        ...item,
                                        id: key
                                    })
                                }
                            } else if (item.familyMemberId == user.id) {
                                // user as a family member
                                if (item.acceptedAt) {
                                    // user has accepted requests of another user
                                    // add to user family
                                    userReceivedFamilyArray.push({
                                        ...item,
                                        id: key
                                    })
                                } else if (!item.rejectedAt) {
                                    // request to this user exists
                                    requestsToUserArray.push({
                                        ...item,
                                        id: key
                                    });
                                }
                            }
                        }
                    }

                    setRequestsToUser(requestsToUserArray);
                    setUserSentRequests(userSentRequestsArray);
                    setUserSentFamily(userSentFamilyArray);
                    setUserReceivedFamily(userReceivedFamilyArray);
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        checkUserFamily();
    }, [])

    var _received = [
        { id: 1, name: "qqqq" },
        { id: 2, name: "aaaa" },
    ]

    var _sent = [
        { id: 1, name: "iiii" },
        { id: 2, name: "pppp" },
    ]

    var _sentFamily = [
        { id: 1, name: "srsrsr" },
        { id: 2, name: "cvcvcv" },
    ]

    var _receivedFamily = [
        { id: 1, name: "rfrfrf" },
        { id: 2, name: "opopop" },
    ]

    return (
        <View style={styles.container}>
            <Text>Family</Text>
            <View>
                <UserReceivedRequests receivedRequests={_received} />
                <UserSentRequests sentRequests={_sent} sendRequest={_sendRequest} />
                <UserFamily userSentFamily={_sentFamily} userReceivedFamily={_receivedFamily} />
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
        backgroundColor: 'yellow'
    },
});