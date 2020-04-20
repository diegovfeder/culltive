import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Easing,
  Dimensions
} from "react-native";

import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators
} from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";

// Hooks
import { useUserDispatch, signOut } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

// Components & Resources
import LoginScreen from "../screen/LoginScreen";
import HomeScreen from "../screen/HomeScreen";
import SettingsScreen from "../screen/SettingsScreen";
import Settings from "../screen/Settings";
import ReportScreen from "../screen/ReportScreen";
import ChartScreen from "../screen/ChartScreen";
import BarCodeScreen from "../screen/BarCodeScreen";
import ProfileScreen from "../screen/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
  }
};

const closeConfig = {
  animation: "timing",
  config: {
    duration: 500,
    easing: Easing.linear
  }
};

// props.navigation.closeDrawer()
function CustomDrawerContent(props) {
  var userDispatch = useUserDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Signout"
        onPress={() => {
          signOut(userDispatch);
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerType={Dimensions.get("window").width > 900 ? "permanent" : "front"}
      drawerContentOptions={{
        activeTintColor: "#3ea341"
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}

export default function HomeNavigator() {
  var navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={DrawerNavigator}
        options={{
          title: "Home",
          headerTitle: () => (
            <View style={styles.headerView}>
              <Text
                style={
                  (styles.headerTitle,
                  { color: "#FFF", fontWeight: "400", fontSize: 24 })
                }
              >
                Diego's LEAF
              </Text>
              <Text
                style={
                  (styles.headerSubtitle,
                  {
                    color: "#FFF",
                    fontWeight: "300",
                    fontSize: 14
                  })
                }
              >
                Acacia Imperial
              </Text>
            </View>
          ),
          headerLeft: () => (
            <Ionicons
              name="md-menu"
              style={styles.headerButton}
              size={24}
              color="#fff"
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            ></Ionicons>
          )
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerTitle: () => <View style={styles.headerView}></View>,
          headerRight: () => (
            <Ionicons
              name="ios-calendar"
              style={styles.headerButton}
              size={24}
              color="#fff"
              onPress={() => alert("Calendar Button")}
            ></Ionicons>
          )
        }}
      />
      <Stack.Screen
        name="Chart"
        component={ChartScreen}
        options={{
          headerTitle: () => <View style={styles.headerView}></View>,
          headerRight: () => (
            <Ionicons
              name="ios-information-circle"
              style={styles.headerButton}
              size={24}
              color="#fff"
              onPress={() => alert("Info Button")}
            ></Ionicons>
          )
        }}
      />
      <Stack.Screen
        name="BarCode"
        component={BarCodeScreen}
        options={{
          headerTitle: () => (
            <View style={styles.headerView}>
              <Text
                style={
                  (styles.headerTitle,
                  { color: "#FFF", fontWeight: "400", fontSize: 17 })
                }
              >
                SCAN CULLTIVE'S QR CODE
              </Text>
              <Text
                style={
                  (styles.headerSubtitle,
                  { color: "#FFF", fontWeight: "300", fontSize: 14 })
                }
              >
                ...
              </Text>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerRight: () => (
            <Ionicons
              name="ios-more"
              style={styles.headerButton}
              size={24}
              color="#fff"
              onPress={() => alert("More Button")}
            ></Ionicons>
          )
        }}
      />
    </Stack.Navigator>
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
  headerTitle: {
    fontFamily: "Helvetica Neue",
    color: "#52575D"
  },
  headerSubTitle: {
    fontFamily: "Helvetica Neue",
    color: "#52575D"
  },
  headerButton: {
    marginHorizontal: 20,
    paddingHorizontal: 10
  }
});
