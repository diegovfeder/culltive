import React, {useEffect, useState} from 'react';
import {AsyncStorage, Text, View} from 'react-native';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// Context
import {
  useUserDispatch,
  useUserState,
  validateUserToken,
} from '../context/UserContext';
import {
  useDeviceDispatch,
  useDeviceState,
  validateDeviceToken,
} from '../context/DeviceContext';

//Screens || Navigators
import SplashNavigator from './SplashNavigator';
import AuthNavigator from './AuthNavigator';
import {DrawerNavigator} from './DrawerNavigator';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  let userDispatch = useUserDispatch();
  let {authenticated, loading} = useUserState();
  let userToken: string | null;
  console.log('AppNavigator: authenticated: ' + authenticated);
  console.log('AppNavigator: loading: ' + loading);

  useEffect(() => {
    const retrieveTokenAsync = async () => {
      try {
        userToken = await AsyncStorage.getItem('@FBIdToken');
      } catch (e) {
        console.log('AppNavigator: Restoring FBIdToken failed');
      }
      console.log('AppNavigator: userToken: ' + userToken);
      validateUserToken(userDispatch, userToken);
    };
    retrieveTokenAsync();
  }, [userDispatch]);

  let deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  let deviceToken: string | null;
  console.log('AppNavigator: paired: ' + paired);

  //FIXME: handle deviceToken better...
  // need to sync paired state with deviceToken?
  useEffect(() => {
    const restoreDeviceToken = async () => {
      try {
        deviceToken = await AsyncStorage.getItem('@deviceToken');
      } catch (e) {
        console.log('AppNavigator: Restoring deviceToken failed');
      }
      console.log('AppNavigator: deviceToken: ' + deviceToken);
      validateDeviceToken(deviceDispatch, deviceToken);
    };
    restoreDeviceToken();
  }, []);

  return (
    // {loading ? (
    //   <Stack.Screen name="Splash" component={Splash} />
    // ) : authenticated ? (
    //   <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
    // ) : (
    //   <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
    // )}
    <>
      {loading ? (
        <SplashNavigator />
      ) : authenticated ? (
        <DrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppNavigator;

// { !authenticated && <AuthNavigator/>}

// <Stack.Navigator
//   headerMode="none"
//   screenOptions={{
//     cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
//     gestureEnabled: true,
//     gestureDirection: 'horizontal',
//   }}>
//   {loading ? (
//     <Stack.Screen name="Splash" component={Splash} />
//   ) : authenticated ? (
//     <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
//   ) : (
//     <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
//   )}
// </Stack.Navigator>
