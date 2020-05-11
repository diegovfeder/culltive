import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import SplashScreen from "../screen/SplashScreen";

import GrantPermissions from '../screen/GrantPermissions';
import WiFiCredentials from '../screen/WiFiCredentials';
import ConnectDevice from '../screen/ConnectDevice';
import Confirmation from '../screen/Confirmation';

const Stack = createStackNavigator();

const PairNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Pair"
      headerMode="float"
      screenOptions={{
        ...TransitionPresets.RevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerShown: false,
      }}>
      <Stack.Screen
        name="GrantPermissions"
        component={GrantPermissions}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="WiFiCredentials"
        component={WiFiCredentials}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="ConnectDevice"
        component={ConnectDevice}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="Confirmation"
        component={Confirmation}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
});

export default PairNavigator;
