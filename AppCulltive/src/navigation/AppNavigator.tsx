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
// import HomeNavigator from './HomeNavigator';
import DrawerNavigator from './DrawerNavigator';
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

    //FIXME: @PAIR from asyncStorage is waiting too much to load.
    // You should re-organize this structure, or get from ContextState
    // fix this in general... it is a async await problem syncing with state thing.
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
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
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
