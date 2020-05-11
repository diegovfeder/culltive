import React, {useEffect, useState} from 'react';
import {AsyncStorage, Text, View} from 'react-native';

// Navigation
// import { NavigationContainer } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// Icons
// import { Ionicons } from "react-native-vector-icons";

// Context API
import {useUserDispatch, validateToken} from '../context/UserContext';
import {useUserState} from '../context/UserContext';

//General Imports
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import Splash from '../screen/Splash';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  let paired = false;
  let userDispatch = useUserDispatch();
  let {authenticated, loading} = useUserState();
  console.log('AppNavigator: authenticated: ' + authenticated);
  console.log('AppNavigator: loading: ' + loading);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('FBIdToken');
      } catch (e) {
        console.log('AppNavigator:  Restoring token failed');
      }

      // TODO: Get QR Code (paired device verification)
      // try {
      //   paired = await AsyncStorage.getItem('qrCode');
      // } catch (e) {
      //   console.log('AppNavigator:  Restoring qr code failed');
      // }

      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({ type: "RESTORE_TOKEN", token: userToken });
      console.log('AppNavigator: userToken: ' + userToken);
      validateToken(userDispatch, userToken);
    };
    bootstrapAsync();
  }, [userDispatch]);

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      {loading ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : authenticated ? (
        paired ? (
          <Stack.Screen name="PairNavigator" component={PairNavigator} />
        ) : (
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
        )
      ) : (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

// TODO: PairNavigator verification --> goes to clean / new / AppFlow
// <Stack.Screen
//   name="PairNavigator"
//   component={PairNavigator}
// />

export default AppNavigator;
