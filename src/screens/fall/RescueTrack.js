import { get, onValue, ref, update } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet,Image } from "react-native";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import {
  getDistanceAndETA,
  getLocationAddress,
  getDistAndETABetweenUsers,
} from "../../util/ETA";
import { Button, Card } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";
import theme from "../../css/theme";

export default function RescueTrack({ route, navigation }) {
  const { fallResId, fallId, isVolunteer, isFamily } = route.params
    ? route.params
    : { fallResId: null, fallId: null, isVolunteer: true, isFamily: false };

  const { user, logoutUser } = useContext(AuthContext);
  const { fbDB } = useContext(FirebaseContext);

  const [fallResData, setFallResData] = useState();
  const [addVolFallResData, setAddVolFallResData] = useState();
  const [fallData, setFallData] = useState();

  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [address, setAddress] = useState();

  const [addVolDistance, setAddVolDistance] = useState();
  const [addVolDuration, setAddVolDuration] = useState();
  const [addVolAddress, setAddVolAddress] = useState();

  const [victimRescued, setVictimRescued] = useState(false);

  const _reachVictim = async () => {
    try {
      // update fall res
      const fallResLocationPath = `fall_response/${fallResId}/`;

      const fallResUpdates = {};
      fallResUpdates[fallResLocationPath + "/reachedAt"] = new Date().getTime();

      await update(ref(fbDB), fallResUpdates);

      // update fall
      const fallLocationPath = `fall/${fallId}/`;

      const fallUpdates = {};
      fallUpdates[fallLocationPath + "/resolvedAt"] = new Date().getTime();

      await update(ref(fbDB), fallUpdates);

      setVictimRescued(true);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const _rescueAck = () => {
    navigation.replace("HomeTabs", {});
  };

  useEffect(() => {
    const fetchFallResData = async (localFallResId) => {
      console.log("fallresId - resmTrack: ", localFallResId);
      // get data here
      const fallResRef = ref(fbDB, "fall_response/" + localFallResId);
      try {
        const snapshot = await get(fallResRef);
        if (snapshot.exists()) {
          console.log("fall res snapshot: ", snapshot.val());

          const snapshotFallResData = snapshot.val();
          if (snapshotFallResData) {
            setFallResData({
              ...snapshotFallResData,
              id: localFallResId,
            });

            const fallRef = ref(fbDB, "fall/" + snapshotFallResData.fallId);
            const fallSnapshot = await get(fallRef);
            if (fallSnapshot.exists()) {
              console.log("fall snapshot: ", fallSnapshot.val());
              const snapshotFallData = fallSnapshot.val();
              if (snapshotFallData) {
                setFallData({
                  ...snapshotFallData,
                  id: snapshotFallResData.fallId,
                });
                console.log("After setting fall data");
                console.log("deviceLat: ", snapshotFallData.deviceLat);
                console.log("deviceLong: ", snapshotFallData.deviceLong);
                var eta = await getDistanceAndETA(
                  snapshotFallData.deviceLat,
                  snapshotFallData.deviceLong
                );
                console.log("eta: ", eta);
                setDuration(eta.duration);
                setDistance(eta.distance);

                // @TODO: add address location here
                var geoLocation = await getLocationAddress(
                  snapshotFallData.deviceLat,
                  snapshotFallData.deviceLong
                );
                console.log("geoLocation: ", geoLocation);
                setAddress(geoLocation.address);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetch fall res data: ", error);
      }
    };

    fetchFallResData(fallResId);
  }, []);

  useEffect(() => {
    // check to see if any volunteer is also rescuing
    if (isFamily) {
      const fallResponsesRef = ref(fbDB, "fall_response");
      try {
        onValue(fallResponsesRef, (snapshot) => {
          var allFallResponses = snapshot.val();
          console.log("res track - allFallResponses: ", allFallResponses);
          if (allFallResponses) {
            for (const [key, item] of Object.entries(allFallResponses)) {
              // console.log("res track - fallId: ", fallId)
              // console.log("res track - item.fallId: ", item.fallId)
              // console.log("res track - fallResId: ", fallResId)
              // console.log("res track - key: ", key)
              // console.log("res track - isVolunteer: ", key)
              if (
                item.fallId == fallId &&
                key != fallResId &&
                "volunteerId" in item &&
                item.volunteerId
              ) {
                // additional volunteer rescue
                console.log("Add vol fall res exists");
                setAddVolFallResData({
                  ...item,
                  id: key,
                });

                break;
              }
            }
          }
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAddVolFallResETA = async (addVolFallResData, fallData) => {
      var eta = await getDistAndETABetweenUsers(
        addVolFallResData.rescueDeviceLat,
        addVolFallResData.rescueDeviceLong,
        fallData.deviceLat,
        fallData.deviceLong
      );

      console.log("add vol eta: ", eta);

      var geoLocation = await getLocationAddress(
        addVolFallResData.rescueDeviceLat,
        addVolFallResData.rescueDeviceLong
      );

      console.log("add vol geoLocation: ", geoLocation);

      setAddVolAddress(geoLocation.address);
      setAddVolDistance(eta.distance);
      setAddVolDuration(eta.duration);
    };

    if (addVolFallResData && fallData) {
      fetchAddVolFallResETA(addVolFallResData, fallData);
    }
  }, [addVolFallResData, fallData]);

  useEffect(() => {
    // check for fall live changes to rescue
    const fallRef = ref(fbDB, "fall/" + fallId);
    try {
      onValue(fallRef, (snapshot) => {
        var fallData = snapshot.val();
        if (fallData && "resolvedAt" in fallData && fallData.resolvedAt) {
          // victim has been successfully rescued
          setVictimRescued(true);
        }
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  }, []);

  return (
    <View style={{marginTop:60,paddingHorizontal:10}}>
      {victimRescued ? (
        <View style={{marginTop:80}}>
          <Text style={[styles.caption, { fontWeight: 'bold' }]}>Rescue Successful!</Text>
          <Image source={require('../../../assets/rescueSuc.png')} style={styles.image} resizeMode="cover" />
          <Button mode="contained" icon="check" onPress={_rescueAck} style={styles.lastbutton}>
            Got It
          </Button>
        </View>
      ) : (
        <View>
          {/* <Text>Rescue Fall Track: {fallResId}</Text> */}
          {/* {
                        isVolunteer && (
                            <Text>isVolunteer: True</Text>
                        )
                    }
                    {
                        isFamily && (
                            <Text>isFamily: True</Text>
                        )
                    } */}
          {fallResData && (
            <Card style={styles.cardstyle}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  color: "black",
                  textAlign: "center",
                }}
              >
                {isFamily ? "YOUR DEAR ONE'S DETAILS: " : "VICTIM DETAILS:"}{" "}
              </Text>
              {fallData && fallData.victim && (
                <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 20 }}>
                    {fallData.victim.firstName} {fallData.victim.lastName}
                  </Text>
                  {/* <Text>Victim Email: {fallData.victim.email}</Text> */}
                  <View style={styles.location}>
                                                                <Text style={[styles.alertText, {textAlign:"center"}]} >FALL LOCATION</Text>
                                                                <Text style={[styles.alertText, {padding:10} , {fontWeight:'bold'}]}>{address}</Text>
                                                                </View>
                  <View style={styles.etaview}>
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"} ]} >Distance</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{distance}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"}]} >ETA</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{duration}</Text>
                          </View>
                        </View>
                  
                </View>
              )}
            </Card>
          )}

          {addVolFallResData && isFamily && (
            <Card style={{marginTop:20, backgroundColor: theme.colors.secondary, paddingHorizontal:5}}>
              <Text style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  color: "black",
                  textAlign: "center",
                }}>A volunteer is also trying to rescue your dear one!</Text>
              {addVolFallResData.volunteer && (
                <View >
                    <View style={{
                  marginTop: 5,
                  
                }}>
                  <Text  >
                    Volunteer Name: 
                  </Text>
                  <Text style={{
                  marginTop: 2,
                  color: "black",
                  fontSize:20
                }}>{addVolFallResData.volunteer.firstName}{" "}
                    {addVolFallResData.volunteer.lastName}</Text>
                  
                 </View>
                 
                
                </View>
              )}
              <View style={styles.location}>
                                                                <Text style={[styles.alertText, {textAlign:"center"}]} >FALL LOCATION</Text>
                                                                <Text style={[styles.alertText, {padding:10} , {fontWeight:'bold'}]}>{addVolAddress}</Text>
                                                                </View>
                  <View style={styles.etaview}>
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"} ]} >Distance</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{addVolDistance}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.half}>
                        <Text style={[styles.alertText, {textAlign:"center"}]} >ETA</Text>
                        <Text style={[styles.alertText, {padding:10}, {fontWeight:'bold'}, {fontSize:23}]}>{addVolDuration}</Text>
                          </View>
                        </View>
              {/* <Text>Volunteer Location: {addVolAddress}</Text>
              <Text>Volunteer ETA Distance to Dear One: {addVolDistance}</Text>
              <Text>Volunteer ETA TIme to Dear One: {addVolDuration}</Text> */}
            </Card>
          )}

          <Button style={styles.lastbutton} mode="contained" onPress={_reachVictim}>
            {isFamily ? "Reached Dear One" : "Reached Victim"}
          </Button>
          {/* <Button title="Logout" onPress={logoutUser}>
            </Button> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 80,
    color: theme.colors.primary,
  },
  cardstyle: {
    backgroundColor: theme.colors.primary,
    marginTop: 20,
  },
  textStyle: {
    color: "#FFFFFF",
    marginLeft: 10,
    marginBottom: 5,
  },
  divider: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  verticaldivider: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  location: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10, // Adjust the value to change the roundness of the corners
    padding: 10,
    marginTop:5
  },
  etaview: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    marginTop:10
  },
  half: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lastbutton: {
    marginTop:20,
   
    justifyContent: 'center',
        alignItems: 'center',
       
        padding: 10,
  },
  caption: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    color: theme.colors.primary
},
image: {
//    flex:1,
   marginTop:20,
     width: '100%',
    height: 450,
},
});
