import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
// import SplashScreen from "../screen/SplashScreen";
import LoginScreen from "../screen/LoginScreen";
import SignupScreen from "../screen/SignupScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  // if (isLoading) {
  //   return <SplashScreen />;
  // }

  return (
    <Stack.Navigator
      initialRouteName="Login"
      headerMode="float"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerStyle: {
          backgroundColor: "#3ea341"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold"
        }
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: () => <View style={styles.headerView}></View> }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerTitle: () => <View style={styles.headerView}></View> }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Helvetica Neue",
    color: "#52575D"
  }
});
