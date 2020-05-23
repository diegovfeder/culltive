import React, {useEffect, useState} from 'react';
import {AsyncStorage, Text, View} from 'react-native';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// Context
import {useUserDispatch, validateUserToken} from '../context/UserContext';
import {useUserState} from '../context/UserContext';
import {useDeviceDispatch, setPaired} from '../context/DeviceContext';
import {useDeviceState} from '../context/DeviceContext';

// Hooks
// TODO: Create a useAsyncStorage custom hook
// import {useAsyncStorage} from '../util/useAsyncStorage';

//Screens || Navigators
import Splash from '../screen/Splash';
import HomeNavigator from './HomeNavigator';
import PairNavigator from './PairNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  let userDispatch = useUserDispatch();
  let userToken: string | null;
  let {authenticated, loading} = useUserState();

  let deviceDispatch = useDeviceDispatch();
  let deviceStatus: string | null;
  let {paired} = useDeviceState();

  console.log('AppNavigator: authenticated: ' + authenticated);
  console.log('AppNavigator: loading: ' + loading);
  console.log('AppNavigator: paired: ' + paired);

  useEffect(() => {
    // Fetch userToken -> toggle authenticated via dispatcher
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

    //TODO: validateDevice using dataDispatcher
    // Fetch deviceToken -> toggle 'paired' flag
    const retrievePairStatusAsync = async () => {
      try {
        deviceStatus = await AsyncStorage.getItem('@PAIR');
      } catch (e) {
        console.log('AppNavigator: Restoring device status failed');
      }
      console.log('AppNavigator: setPaired: ' + deviceStatus);
      if (deviceStatus != null) {
        setPaired(deviceDispatch, true);
      } else {
        setPaired(deviceDispatch, false);
      }
    };
    retrievePairStatusAsync();
  }, [userDispatch, deviceDispatch]);

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
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
        ) : (
          <Stack.Screen name="PairNavigator" component={PairNavigator} />
        )
      ) : (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
