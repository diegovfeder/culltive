import React, {useEffect, useState} from 'react';
import {AsyncStorage, Text, View} from 'react-native';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// Context
import {useUserDispatch, validateToken} from '../context/UserContext';
import {useUserState} from '../context/UserContext';

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
  let {authenticated, loading} = useUserState();
  let [paired, setPaired] = useState(false);
  let userToken;
  let deviceToken;

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
      validateToken(userDispatch, userToken);
    };
    retrieveTokenAsync();

    //TODO: validateDevice using dataDispatcher
    // Fetch deviceToken -> toggle 'paired' flag
    const retrievePairStatusAsync = async () => {
      try {
        deviceToken = await AsyncStorage.getItem('@DeviceTokenn');
      } catch (e) {
        console.log('AppNavigator: Restoring deviceToken failed');
      }
      console.log('AppNavigator: deviceToken: ' + deviceToken);
      if (deviceToken != null) {
        setPaired(true);
      } else {
        setPaired(false);
      }
    };
    retrievePairStatusAsync();
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
