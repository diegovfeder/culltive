import React from "react";
import { Text, View, ScrollView } from "react-native";
// import { globalStyles } from "../styles/global";

// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// TODO: Develop / Design this Screen
export default function SettingsScreen() {
  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Device</Text>
        <Text>Edit profile</Text>
        <Text>Change password</Text>

        <Text>Account</Text>
        <Text>Edit profile</Text>
        <Text>Change password</Text>

        <Text>Notifications</Text>
        <Text>Edit profile</Text>
        <Text>Change password</Text>

        <Text>More</Text>
        <Text>Language</Text>
        <Text>Change password</Text>
      </View>
    </ScrollView>
  );
}
