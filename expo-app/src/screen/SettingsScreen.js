import React from "react";
import {
  Text,
  View,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from "react-native";

import { Slider } from "react-native-elements";
import { Divider } from "react-native-paper";

import { globalStyles } from "../style/global";

import { useNavigation } from "@react-navigation/native";

// import base from "../util/rebase.js";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [isLEDEnabled, setIsLEDEnabled] = React.useState(true);
  const toggleLEDSwitch = () =>
    setIsLEDEnabled(previousState => !previousState);

  const [isAWEnabled, setIsAWEnabled] = React.useState(true);
  const toggleAWSwitch = () => setIsAWEnabled(previousState => !previousState);

  const [sliderValue, setSliderValue] = React.useState(5);

  React.useEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerTitle: () => (
        <View style={globalStyles.headerView}>
          <Text
            style={
              (globalStyles.headerTitle,
              {
                color: "#FFF",
                fontWeight: "400",
                fontSize: 22
              })
            }
          >
            Settings
          </Text>
        </View>
      )
    });
  }, []);

  return (
    <View style={[styles.container, { padding: 6 }]}>
      {/*ACCOUNT*/}
      <View style={styles.accountContainer}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="ios-contact"
            size={40}
            color="#353535"
            style={{ marginRight: 12, alignSelf: "center" }}
          ></Ionicons>
          <Text
            style={
              (styles.text,
              { fontWeight: "200", fontSize: 32, alignSelf: "center" })
            }
          >
            Account
          </Text>
        </View>
        <View style={{ flexDirection: "column", marginHorizontal: 12 }}>
          <Text
            style={
              (styles.text,
              { color: "#AEB5BC", fontSize: 20, marginVertical: 8 })
            }
          >
            Username:
          </Text>
          <Text
            style={
              (styles.text,
              { color: "#AEB5BC", fontSize: 20, marginVertical: 8 })
            }
          >
            Change Password:
          </Text>
          <Text
            style={
              (styles.text,
              { color: "#AEB5BC", fontSize: 20, marginVertical: 8 })
            }
          >
            Facebook:
          </Text>
        </View>
      </View>
      <Divider style={globalStyles.divider} />
      {/*DEVICE*/}
      <View style={styles.deviceContainer}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="ios-settings"
            size={40}
            color="#353535"
            style={{ marginRight: 12, alignSelf: "center" }}
          ></Ionicons>
          <Text
            style={
              (styles.text,
              { fontWeight: "200", fontSize: 32, alignSelf: "center" })
            }
          >
            Device
          </Text>
        </View>

        <View style={{ flexDirection: "column", marginHorizontal: 12 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={
                (styles.text,
                { color: "#AEB5BC", fontSize: 20, alignSelf: "center" })
              }
            >
              LED State
            </Text>
            <Switch
              style={{ margin: 12 }}
              trackColor={{ false: "#767577", true: "#3ea341" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLEDSwitch}
              value={isLEDEnabled}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={
                (styles.text,
                { color: "#AEB5BC", fontSize: 20, alignSelf: "center" })
              }
            >
              Automatic Watering
            </Text>
            <Switch
              style={{ margin: 12 }}
              trackColor={{ false: "#767577", true: "#3ea341" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAWSwitch}
              value={isAWEnabled}
            />
          </View>

          <Text
            style={
              (styles.text,
              {
                color: "#AEB5BC",
                fontSize: 20,
                alignSelf: "flex-start",
                marginTop: 14
              })
            }
          >
            Water Interval
          </Text>
          <Slider
            style={{ marginHorizontal: 8 }}
            disabled={isAWEnabled}
            minimumValue={1}
            maximumValue={5}
            step={1}
            thumbTintColor={isAWEnabled ? "#767577" : "#3ea341"}
            value={sliderValue}
            onValueChange={value => setSliderValue(value)}
          />

          <Text
            style={
              (styles.text,
              {
                color: "#AEB5BC",
                fontSize: 16,
                alignSelf: "flex-end",
                right: "5%"
              })
            }
          >
            {sliderValue}
            {sliderValue == 1 ? " Hour" : " Hours"}
          </Text>
        </View>
      </View>
      <Divider style={globalStyles.divider} />

      {/*ACCOUNT*/}
      <View style={styles.accountContainer}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="ios-apps"
            size={40}
            color="#353535"
            style={{ marginRight: 12, alignSelf: "center" }}
          ></Ionicons>
          <Text
            style={
              (styles.text,
              { fontWeight: "200", fontSize: 32, alignSelf: "center" })
            }
          >
            More
          </Text>
        </View>
        <View style={{ flexDirection: "column", marginHorizontal: 12 }}>
          <Text
            style={
              (styles.text,
              { color: "#AEB5BC", fontSize: 20, marginVertical: 8 })
            }
          >
            Language:
          </Text>
        </View>
      </View>
      <Divider style={globalStyles.divider} />

      {/*WATER PUMP BUTTON*/}
      <TouchableOpacity
        style={[globalStyles.touchableOpacityButton2]}
        onPress={() => window.alert("PUMPING WATTA")}
        // TODO: Develop a endpoint for waterPump
      >
        <Text style={[globalStyles.headerTitle]}>Water Pump</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  accountContainer: {
    alignItems: "stretch",
    margin: 16
  },
  deviceContainer: {
    alignItems: "stretch",
    margin: 16
  },
  text: {
    fontFamily: "Helvetica Neue",
    color: "#52575D"
  },
  subText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#AEB5BC",
    textTransform: "uppercase"
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16
  },
  profileImage: {
    marginTop: 32,
    width: 250,
    height: 250,
    borderRadius: 250,
    overflow: "hidden"
  },
  dm: {
    backgroundColor: "#414448",
    position: "absolute",
    top: 42,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 20,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  add: {
    backgroundColor: "#414448",
    position: "absolute",
    bottom: 0,
    right: 0,
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
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  recentItemIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20
  }
});

// <View style={globalStyles.container}>
//   <View
//     style={{
//       flex: 1,
//       flexDirection: "column",
//       justifyContent: "space-between",
//       alignItems: "center"
//     }}
//   >
//     <View
//       style={{
//         flex: 1,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "flex-start"
//       }}
//     >
//       <Ionicons name="ios-contact" size={48} color="#555"></Ionicons>
//       <Text style={[globalStyles.h1, { flex: 1, marginHorizontal: 6 }]}>
//         Account
//       </Text>
//     </View>
//     <Text style={globalStyles.h2}>Edit Profile</Text>
//     <Text style={globalStyles.h2}>Change Password</Text>
//     <Text style={globalStyles.h2}>Connect Facebook</Text>
//   </View>
//
//   <View
//     style={{
//       flex: 1,
//       flexDirection: "column",
//       justifyContent: "space-between",
//       alignItems: "flex-start"
//     }}
//   >
//     <View
//       style={{
//         flexDirection: "row"
//       }}
//     >
//       <Ionicons
//         name="ios-settings"
//         size={48}
//         color="#555"
//         style={{ margin: 12 }}
//       ></Ionicons>
//       <Text style={[globalStyles.h1, { flex: 1, margin: 12 }]}>Device</Text>
//     </View>
//     <View
//       style={{
//         flexDirection: "row",
//         marginHorizontal: 24
//       }}
//     >
//       <Text style={[globalStyles.h2, { flex: 1, margin: 12 }]}>
//         LED Tape
//       </Text>
//       <Switch
//         style={{ margin: 12 }}
//         trackColor={{ false: "#767577", true: "#3ea341" }}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={toggleLEDSwitch}
//         value={isLEDEnabled}
//       />
//     </View>
//     <View
//       style={{
//         flexDirection: "row",
//         marginHorizontal: 24
//       }}
//     >
//       <Text style={[globalStyles.h2, { flex: 1, margin: 12 }]}>
//         Automatic Watering
//       </Text>
//       <Switch
//         style={{ margin: 12 }}
//         trackColor={{ false: "#767577", true: "#3ea341" }}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={toggleAWSwitch}
//         value={isAWEnabled}
//       />
//     </View>
//     <View
//       style={{
//         flex: 1,
//         flexDirection: "column",
//         marginHorizontal: 36,
//         alignItems: "stretch"
//       }}
//     >
//       <Text style={globalStyles.h2}>Water Interval</Text>
//       <Slider
//         trackStyle={{}}
//         disabled={isAWEnabled}
//         minimumValue={1}
//         maximumValue={5}
//         step={1}
//         thumbTintColor={isAWEnabled ? "#767577" : "#3ea341"}
//         value={sliderValue}
//         onValueChange={value => setSliderValue(value)}
//       />
//       <Text style={[globalStyles.h3, {}]}>
//         {sliderValue}
//         {sliderValue == 1 ? " Hour" : " Hours"}
//       </Text>
//     </View>
//   </View>
//
//   <View style={{ paddingHorizontal: 24 }}>
//     <TouchableOpacity
//       style={[globalStyles.touchableOpacityButton]}
//       onPress={() => window.alert("PUMPING WATTA")}
//       // TODO: Develop a endpoint for waterPump
//     >
//       <Text style={[globalStyles.headerTitle]}>Water Pump</Text>
//     </TouchableOpacity>
//   </View>
// </View>
