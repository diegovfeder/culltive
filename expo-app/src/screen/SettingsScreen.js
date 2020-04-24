import React from "react";
import { Text, View, Switch, TouchableOpacity } from "react-native";

import { Slider } from "react-native-elements";

import { globalStyles } from "../style/global";

import { useNavigation } from "@react-navigation/native";

// import base from "../util/rebase.js";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [isLEDEnabled, setIsLEDEnabled] = React.useState(false);
  const toggleLEDSwitch = () =>
    setIsLEDEnabled(previousState => !previousState);

  const [isAWEnabled, setIsAWEnabled] = React.useState(false);
  const toggleAWSwitch = () => setIsAWEnabled(previousState => !previousState);

  const [sliderValue, setSliderValue] = React.useState("10");

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
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View
        style={{
          flex: 0.5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        <Ionicons
          name="ios-contact"
          size={48}
          color="#555"
          style={{ marginHorizontal: 12 }}
        ></Ionicons>
        <Text style={[globalStyles.h1, { flex: 1, margin: 12 }]}>Account</Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <Ionicons
            name="ios-settings"
            size={48}
            color="#555"
            style={{ marginHorizontal: 12 }}
          ></Ionicons>
          <Text style={[globalStyles.h1, { flex: 1, margin: 12 }]}>Device</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 24
          }}
        >
          <Text style={[globalStyles.h2, { flex: 1, margin: 12 }]}>
            LED Tape
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
          style={{
            flexDirection: "row",
            marginHorizontal: 24
          }}
        >
          <Text style={[globalStyles.h2, { flex: 1, margin: 12 }]}>
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
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginHorizontal: 24
          }}
        >
          <Text style={globalStyles.h2}>Water Interval</Text>
          <Slider
            trackStyle={{}}
            disabled={isAWEnabled}
            minimumValue={1}
            maximumValue={5}
            step={1}
            thumbTintColor={isAWEnabled ? "#767577" : "#3ea341"}
            value={sliderValue}
            onValueChange={value => setSliderValue(value)}
          />
          <Text style={globalStyles.h3}>
            {sliderValue}
            {sliderValue == 1 ? " Hour" : " Hours"}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        <TouchableOpacity
          style={[globalStyles.touchableOpacityButton]}
          onPress={() => window.alert("PUMPING WATTA")}
        >
          <Text style={[globalStyles.headerTitle]}>Water Pump</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
