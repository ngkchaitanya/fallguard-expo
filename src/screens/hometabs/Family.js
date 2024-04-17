import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ListView } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { AuthContext } from "../../contexts/AuthContext";
import { get, onValue, push, ref, update } from "firebase/database";
import UserReceivedRequests from "../../components/UserReceivedRequests";
import UserSentRequests from "../../components/UserSentRequests";
import UserFamily from "../../components/UserFamily";
import Toast from 'react-native-toast-message';
import theme from "../../css/theme";

export default function Family() {
    const { fbDB } = useContext(FirebaseContext);
    const { user } = useContext(AuthContext);

    const [requestsToUser, setRequestsToUser] = useState([]);
    const [userSentRequests, setUserSentRequests] = useState([]);
    const [userSentFamily, setUserSentFamily] = useState([]);
    const [userReceivedFamily, setUserReceivedFamily] = useState([]);

    const _sendRequest = async (requestEmail) => {
        // setRequestError("");
        console.log("send request in family: ", requestEmail)

        if (requestEmail == user.email) {
            // setRequestError("You can't send request to your own email!");
            Toast.show({
                type: 'error',
                text1: "You can't send request to your own email!",
            });
            return;
        }

        // check if the the request already exists
        const usersFamilyRef = ref(fbDB, 'user_family');
        const usersRef = ref(fbDB, 'user');

        try {
            // 1. check if user has sent any requests previously
            const snapshot = await get(usersFamilyRef);
            console.log("snapshot: ", snapshot)
            if (snapshot.exists()) {
                console.log('Node exists:', snapshot.val());
                // Retrieve users data
                const usersFamilyData = snapshot.val();
                if (usersFamilyData) {
                    for (const [key, item] of Object.entries(usersFamilyData)) {
                        console.log('Key:', key);
                        console.log('user_family item:', item);
                        if (item.familyMemberEmail == requestEmail && item.userId == user.id) {
                            console.log("--- request already exists to family member")
                            // whether the request is pending or accepted or rejected
                            if (("acceptedAt" in item) && item.acceptedAt) {
                                // setRequestError("The requested family member is already added!")
                                Toast.show({
                                    type: 'error',
                                    text1: "The requested family member is already added!",
                                });
                            } else if (("rejectedAt" in item) && item.rejectedAt) {
                                // setRequestError("The requested family member has rejected your request already!")
                                Toast.show({
                                    type: 'error',
                                    text1: "The requested family member has rejected your request already!",
                                    // text2: "The requested family member has rejected your request already!",
                                });
                            } else {
                                // setRequestError("The request has already been sent earlier!")
                                Toast.show({
                                    type: 'error',
                                    text1: "The request has already been sent earlier!",
                                });
                            }

                            return;
                        }
                    }
                }

                // 2. check if user has received any requests previously from target family member
                // check for the user id of the family member
                console.log("about to check if family member has sent any request")
                const usersSnapshot = await get(usersRef);
                console.log("usersSnapshot: ", usersSnapshot)
                if (usersSnapshot.exists()) {
                    var familyMemberId = "";
                    const usersData = usersSnapshot.val();
                    if (usersData) {
                        for (const [key, item] of Object.entries(usersData)) {
                            console.log("user key: ", key)
                            console.log("user item: ", item)
                            if (item.email == requestEmail) {
                                console.log("family member has a row in user table")
                                familyMemberId = key;

                                break;
                            }
                        }
                    }


                    console.log("familyMemberId: ", familyMemberId)
                    if (familyMemberId) {
                        for (const [key, item] of Object.entries(usersFamilyData)) {
                            if (item.familyMemberEmail == user.email && item.userId == familyMemberId) {
                                console.log(" --- family member has sent a request to user previously")
                                // whether the request is pending or accepted or rejected
                                if (("acceptedAt" in item) && item.acceptedAt) {
                                    // setRequestError("The requested family member is already added!")
                                    Toast.show({
                                        type: 'error',
                                        text1: "The requested family member is already added!",
                                    });
                                } else if (("rejectedAt" in item) && item.rejectedAt) {
                                    // setRequestError("The requested family member has rejected your request already!")
                                    Toast.show({
                                        type: 'error',
                                        text1: "You have previously rejected the family member's request!",
                                        // text2: "The requested family member has rejected your request already!",
                                    });
                                } else {
                                    // setRequestError("The request has already been sent earlier!")
                                    Toast.show({
                                        type: 'error',
                                        text1: "Family member has already sent you a request. Please accept that!",
                                    });
                                }

                                return;
                            }
                        }
                    }
                }
            }

            // console.log("Before push");
            // If user family not found, add it to the database
            // form user_family
            var requestData = {
                userId: user.id,
                familyMemberEmail: requestEmail,
                requestedAt: new Date().getTime(),
                acceptedAt: null,
                rejectedAt: null,
                createdAt: new Date().getTime(),
            }
            await push(usersFamilyRef, requestData);

            // @TODO: show success toast
            // msg: request has been successfully sent
            // console.log("@@@ request has been successfully sent")
            Toast.show({
                type: 'success',
                text1: "The request has been successfully sent!",
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const _accpetRequest = async (requestId) => {
        try {
            // Path to the specific item's location in Firebase
            const itemLocationPath = `user_family/${requestId}`;
            console.log("itemLocationPath: ", itemLocationPath)

            // Prepare the update object
            const updates = {};
            updates[itemLocationPath + '/familyMemberId'] = user.id;
            updates[itemLocationPath + '/acceptedAt'] = new Date().getTime();
            console.log("updates: ", updates)

            // Update the data in Firebase
            await update(ref(fbDB), updates)
            console.log(`Location updated for ${requestId}`);

            Toast.show({
                type: 'success',
                text1: "Accepted family member's request!",
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const _rejectRequest = async (requestId) => {
        try {
            // Path to the specific item's location in Firebase
            const itemLocationPath = `user_family/${requestId}`;
            console.log("itemLocationPath: ", itemLocationPath)

            // Prepare the update object
            const updates = {};
            updates[itemLocationPath + '/familyMemberId'] = user.id;
            updates[itemLocationPath + '/rejectedAt'] = new Date().getTime();
            console.log("updates: ", updates)

            // Update the data in Firebase
            await update(ref(fbDB), updates)
            console.log(`Location updated for ${requestId}`);

            Toast.show({
                type: 'info',
                text1: "Rejected family member's request!",
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    useEffect(() => {
        const checkUserFamily = async () => {
            const userFamilyRef = ref(fbDB, 'user_family');
            // console.log("userFamilyRef: ", userFamilyRef)

            try {
                onValue(userFamilyRef, (snapshot) => {
                    var userFamilyData = snapshot.val();
                    // console.log("userFamilyData: ", userFamilyData)

                    var requestsToUserArray = [];
                    var userSentRequestsArray = [];
                    var userSentFamilyArray = [];
                    var userReceivedFamilyArray = [];

                    if (userFamilyData) {
                        for (const [key, item] of Object.entries(userFamilyData)) {
                            console.log("item: ", item)
                            if (item.userId == user.id) {
                                console.log("case 1")
                                // user related
                                // user has sent requests
                                if (("acceptedAt" in item) && item.acceptedAt) {
                                    console.log("case 1 - 1")
                                    // family member has accepted the user's request
                                    // add to user family
                                    userSentFamilyArray.push({
                                        ...item,
                                        id: key
                                    })
                                } else {
                                    console.log("case 1 - 2")
                                    if (("rejectedAt" in item) && item.rejectedAt) {
                                        console.log("case 1 - 2 - 1")
                                        // rejected
                                    } else {
                                        console.log("case 1 - 2 - 2")
                                        // request sent by user is pending
                                        userSentRequestsArray.push({
                                            ...item,
                                            id: key
                                        })
                                    }
                                }
                            } else if (item.familyMemberEmail == user.email) {
                                console.log("case 2")
                                // user as a family member
                                if (("acceptedAt" in item) && item.acceptedAt) {
                                    console.log("case 2 - 1")
                                    // user has accepted requests of another user
                                    // add to user family
                                    userReceivedFamilyArray.push({
                                        ...item,
                                        id: key
                                    })
                                } else {
                                    console.log("case 2 - 2")
                                    if (("rejectedAt" in item) && item.rejectedAt) {
                                        console.log("case 2 - 2 - 1")
                                        // rejected
                                    } else {
                                        console.log("case 2 - 2 - 2")
                                        // request to this user exists - pending
                                        requestsToUserArray.push({
                                            ...item,
                                            id: key
                                        });
                                    }
                                }
                            }
                        }
                    }

                    const usersRef = ref(fbDB, 'user');
                    // console.log(' --- usersRef:', usersRef);
                    get(usersRef).then((usersSnapshot) => {
                        // console.log(" --- usersSnapshot: ", usersSnapshot)
                        if (usersSnapshot.exists()) {
                            // console.log(' --- Node exists:', usersSnapshot.val());
                            // Retrieve users data
                            const usersData = usersSnapshot.val();
                            // console.log(" --- usersData: ", usersData)
                            if (usersData) {
                                if (requestsToUserArray && requestsToUserArray.length) {
                                    // console.log(" --- requestsToUserArray: ", requestsToUserArray)
                                    for (const item of requestsToUserArray) {
                                        // console.log("item.userId: ", item.userId);
                                        // console.log("usersData[item.userId]: ", usersData[item.userId]);
                                        if (usersData[item.userId]) {
                                            // console.log("exists")
                                            item.sender = {
                                                id: item.userId,
                                                ...usersData[item.userId]
                                            }
                                        }
                                    }
                                } else {
                                    // console.log("NO requestsToUserArray")
                                }

                                if (userSentFamilyArray && userSentFamilyArray.length) {
                                    for (const item of userSentFamilyArray) {
                                        console.log("userSentFamilyArray - item: ", item);
                                        console.log("userSentFamilyArray - item.familyMemberEmail: ", item.familyMemberEmail);
                                        for (const [familyUserId, familyUser] of Object.entries(usersData)) {
                                            console.log("familyUserId: ", familyUserId)
                                            console.log("familyUser: ", familyUser)
                                            if (item.familyMemberEmail == familyUser.email) {
                                                console.log(" --- family member match")
                                                item.familyMember = {
                                                    id: item.familyUserId,
                                                    ...familyUser
                                                }

                                                break; // @TODO: check if this is causing any issues
                                            }
                                        }
                                    }
                                } else {
                                    console.log("NO userSentFamilyArray")
                                }

                                if (userReceivedFamilyArray && userReceivedFamilyArray.length) {
                                    for (const item of userReceivedFamilyArray) {
                                        // console.log("item.userId: ", item.userId);
                                        // console.log("usersData[item.userId]: ", usersData[item.userId]);
                                        if (usersData[item.userId]) {
                                            // console.log("exists")
                                            item.sender = {
                                                id: item.userId,
                                                ...usersData[item.userId]
                                            }
                                        }
                                    }
                                } else {
                                    console.log("NO userReceivedFamilyArray")
                                }
                            } else {
                                // console.log(" --- NO usersdat")
                            }

                        }

                        // @see: needs to update state after the promise is returned
                        setRequestsToUser(requestsToUserArray); // add sender information
                        setUserSentRequests(userSentRequestsArray); // no need for additional data
                        setUserSentFamily(userSentFamilyArray); // add family member information
                        setUserReceivedFamily(userReceivedFamilyArray); // add family member information
                    })
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
            <ScrollView>
                {/* <ListView> */}
                <View style={styles.familySections}>
                    <UserSentRequests sentRequests={userSentRequests} sendRequest={_sendRequest} />
                    {requestsToUser.length > 0 && (<UserReceivedRequests receivedRequests={requestsToUser} accpetRequest={_accpetRequest} rejectRequest={_rejectRequest} />)}
                    {(userSentFamily.length > 0 || userReceivedFamily.length > 0) && (<UserFamily userSentFamily={userSentFamily} userReceivedFamily={userReceivedFamily} />)}
                </View>
                {/* </ListView> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF'
    },
    familySections: {
        display: 'flex',
        width: '100%'
    }
});