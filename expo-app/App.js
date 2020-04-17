import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { DataProvider } from "./src/context/DataContext";
import { UserProvider } from "./src/context/UserContext";
import { FirebaseProvider } from "./src/context/FirebaseContext";
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators
} from "@react-navigation/stack";

import AppNavigator from "./src/navigation/AppNavigator";
import HomeScreen from "./src/screen/HomeScreen";
import ReportScreen from "./src/screen/ReportScreen";

import axios from "axios";

const Stack = createStackNavigator();

axios.defaults.baseURL = "https://us-central1-culltive.cloudfunctions.net/api";

export default function App() {
  return (
    <FirebaseProvider>
      <DataProvider>
        <UserProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </DataProvider>
    </FirebaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
