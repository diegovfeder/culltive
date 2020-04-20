import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator
} from "react-native";
import { globalStyles } from "../style/global";
import { useNavigation } from "@react-navigation/native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Divider } from "react-native-paper";

// Hooks
import {
  useDataState,
  useDataDispatch,
  getDevices,
  getReadings
} from "../context/DataContext";
import {
  useUserState,
  useUserDispatch,
  getUserData
} from "../context/UserContext";

export default function HomeScreen() {
  var dataDispatch = useDataDispatch();
  const { devices, loadingDevices, readings, loadingReadings } = useDataState();

  // TODO: Finish this userData thing
  var userDispatch = useUserDispatch();
  var { userData } = useUserState();

  const navigation = useNavigation();
  const [modal, setModal] = React.useState(false);

  // React.useEffect(() => {
  //   // console.log("Home userData: " + JSON.stringify(userData));
  //   // TODO: Find a way to async await getData or else...
  //   getUserData(userDispatch);
  //
  //   navigation.setOptions({
  //     title: "Home",
  //     headerTitle: () => (
  //       <View style={styles.headerView}>
  //         <Text
  //           style={
  //             (styles.headerTitle,
  //             { color: "#FFF", fontWeight: "400", fontSize: 24 })
  //           }
  //         >
  //           {userData != null ? userData.userName + "'s LEAF" : "My Plant"}
  //         </Text>
  //         <Text
  //           style={
  //             (styles.headerSubtitle,
  //             {
  //               color: "#FFF",
  //               fontWeight: "300",
  //               fontSize: 14,
  //               alignSelf: "center"
  //             })
  //           }
  //         ></Text>
  //       </View>
  //     )
  //   });
  //   // setModal(true);
  //   // getDevices(dataDispatch);
  //   // getReadings(dataDispatch);
  //   // console.log(devices.data);
  //   // console.log(readings.data);
  // }, []);

  return (
    <View style={globalStyles.container}>
      <Modal
        style={globalStyles.modal}
        visible={modal}
        animation={"fade"}
        transparent={true}
        presentationStyle={"overFullScreen"}
      >
        <View style={{ backgroundColor: "000000aa", flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              marginTop: 120,
              marginBottom: 40,
              marginHorizontal: 30,
              paddingTop: 36,
              paddingHorizontal: 30,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 2.65,
              elevation: 4
            }}
          >
            <Text style={{ fontSize: 32 }}>This is a Modal...</Text>

            <TouchableOpacity
              style={globalStyles.touchableOpacityButton}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  { color: "#fff", fontWeight: "600", fontSize: 16 }
                ]}
              >
                Close Modal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView>
        {/*GREEN CIRCLE / LAZY LOADING*/}
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            marginTop: 48,
            borderRadius: 300,
            width: 300,
            height: 300,
            backgroundColor: "#DDD"
          }}
        >
          <ActivityIndicator
            size={"large"}
            style={(styles.activityIndicator, { flex: 1 })}
          />
        </View>
        {/*IMAGE*/}
        <View style={{ alignSelf: "center" }}>
          <View style={styles.homeImage}>
            {/*// TODO: Create a get Image from Firebase or Facebook / Google or  else...*/}

            <Image
              source={require("../image/acacia4.jpg")}
              style={styles.image}
              resizeMode="center"
            ></Image>
          </View>
          {/*<TouchableOpacity style={styles.add}>*/}
          <View style={styles.add}>
            <Ionicons
              name="ios-add"
              size={48}
              color="#FFF"
              style={{ marginTop: 6, marginLeft: 2 }}
            ></Ionicons>
          </View>
          {/*</TouchableOpacity>*/}
        </View>

        {/*INFO*/}
        <View style={styles.infoContainer}>
          <Text
            style={(globalStyles.text, { fontWeight: "200", fontSize: 32 })}
          >
            Status:
          </Text>
          <Text style={(globalStyles.text, { color: "#AEB5BC", fontSize: 16 })}>
            Flowering
          </Text>
        </View>

        {/*STATS*/}
        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[globalStyles.text, { fontSize: 24 }]}>68</Text>
            <Text style={[globalStyles.text, globalStyles.subText]}>Days</Text>
          </View>
          <View
            style={[
              styles.statsBox,
              {
                borderColor: "#DFD8C8",
                borderLeftWidth: 1,
                borderRightWidth: 1
              }
            ]}
          >
            <Text style={[globalStyles.text, { fontSize: 24 }]}>9</Text>
            <Text style={[globalStyles.text, globalStyles.subText]}>Weeks</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[globalStyles.text, { fontSize: 24 }]}>2</Text>
            <Text style={[globalStyles.text, globalStyles.subText]}>
              Months
            </Text>
          </View>
        </View>
        <Divider style={globalStyles.divider} />

        {/*RECENT ACTIVITY*/}
        <ScrollView>
          <Text style={[globalStyles.subText, styles.recentTitle]}>
            Recent Activity
          </Text>
          <View style={{ alignItems: "start", marginLeft: 8 }}>
            <View style={styles.recentItem}>
              <View style={styles.recentItemIndicator}></View>
              <View style={{ widht: 250 }}>
                <Text
                  style={[
                    globalStyles.text,
                    { color: "#41444B", fontWeight: "300" }
                  ]}
                >
                  Status update:
                  <Text style={{ fontWeight: "400" }}>
                    {" "}
                    Flowering
                    {/*<Text style={{ fontWeight: "400" }}> Ana Luiza</Text>*/}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.recentItemIndicator}></View>
              <View style={{ widht: 250 }}>
                <Text
                  style={[
                    globalStyles.text,
                    { color: "#41444B", fontWeight: "300" }
                  ]}
                >
                  Status update:
                  <Text style={{ fontWeight: "400" }}> Budding</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <Divider style={globalStyles.divider} />
      </ScrollView>

      <TouchableOpacity
        style={globalStyles.touchableOpacityButton}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={[globalStyles.headerTitle]}>Daily Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  homeImage: {
    marginTop: 48,
    width: 300,
    height: 300,
    borderRadius: 300,
    overflow: "hidden"
  },
  add: {
    backgroundColor: "#3ea341",
    position: "absolute",
    bottom: 0,
    right: "10%",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32
  },
  statsBox: {
    flex: 1,
    alignItems: "center"
  },
  recentTitle: {
    marginLeft: 6,
    marginBottom: 12,
    fontSize: 14
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  recentItemIndicator: {
    backgroundColor: "#3ea341",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20
  }
});
