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
  signOut,
  saveUserToken,
  getUser,
  changeLoadingState,
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

// Decode Firebase auth token
import jwtDecode from 'jwt-decode';
// var jwtDecode = require('jwt-decode');
// var decoded = jwtDecode('testString', {body: true});
// console.log('Decoded: ' + decoded);

//Not using stack navigator because AppNavigator handles it by if statement...
// const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  console.log('*** AppNavigator.tsx ***');
  let userDispatch = useUserDispatch();
  let {user, userData, authenticated, loading, token} = useUserState();
  let userToken: string | null;

  let deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  let deviceToken: string | null;

  useEffect(() => {
    console.log('-- AppNavigator useEffect(printUserContext):');
    console.log('loading: ' + loading);
    console.log('authenticated: ' + authenticated);
    console.log('paired: ' + paired);
    console.log('token: ' + token);
    console.log('user: ' + user);
  }, [loading, authenticated, paired, token, user]);

  // **USER AUTH TOKEN USEFFECT
  // Recover asyncStorage token and decode it / veryfing if it has expired and then getUserData.
  useEffect(() => {
    console.log('RetrieveTokenAsync!');
    const retrieveTokenAsync = async () => {
      try {
        userToken = await AsyncStorage.getItem('@FBIdToken');
        // console.log('AppNavigator: AWAITED userToken: ' + userToken);
        if (userToken === null) {
          console.log('userToken is null, wait in welcomeScreen');
          // if nothing happens here App stays frozen in Splash
          // do something to loading...
          changeLoadingState(userDispatch, false);
          // loading = false;
        } else {
          console.log('userToken isnt null, lets decode and save!');
          const decodedToken = jwtDecode(userToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log('token failed to pass decode: () => signOut');
            signOut(userDispatch);
          } else {
            console.log('token decoded: () => saveUserToken');
            // console.log('AppNavigator: validateToken call');
            saveUserToken(userDispatch, userToken);
          }
        }
        // saveUserToken(userDispatch, userToken);
      } catch (e) {
        console.log('AppNavigator: Restoring FBIdToken failed');
      }

      // console.log('Trying to get userData:');
      // getUser(userDispatch, 'diegovfeder@gmail.com', userToken);
    };
    retrieveTokenAsync();
  }, []);

  // Retrieve userData
  // useEffect(() => {
  //   if (!!token) {
  //     console.log('TODO: getUser without handle, only Authorization header');
  //     // console.log('getUser! ' + 'diegovfeder@gmail.com' + token);
  //     getUser(userDispatch, 'diegovfeder@gmail.com', token);
  //   } else {
  //     console.log('user is not signed yet / no token');
  //   }
  // }, [token]);

  // ** DEVICE TOKEN USEFFECT
  //FIXME: handle deviceToken better...
  // need to sync paired state with deviceToken?
  useEffect(() => {
    const restoreDeviceToken = async () => {
      try {
        deviceToken = await AsyncStorage.getItem('@deviceToken');
        // console.log('AppNavigator: AWAITED deviceToken: ' + deviceToken);
        validateDeviceToken(deviceDispatch, deviceToken);
      } catch (e) {
        console.log('AppNavigator: Restoring deviceToken failed');
      }
    };
    restoreDeviceToken();
  }, []);

  return (
    <>
      {loading ? (
        <SplashNavigator />
      ) : authenticated ? (
        // DrawerNavigator means Home branch I guess...
        <DrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppNavigator;

// validateTokenAsync??
//... code to validateToken like socialApe
// if (userToken) {
//   console.log('userToken!');
//   const decodedToken = jwtDecode(userToken);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     signOut(userDispatch);
//     console.log('signOut');

//     // TODO: Go to login or welcome...
//     // window.location.href = '/login';
//   } else {
//     console.log('AppNavigator: validateToken call');
//     saveUserToken(userDispatch, userToken);
//     // axios.defaults.headers.common['Authorization'] = token;

//     // getUser(userDispatch, 'diegovfeder@gmail.com', userToken);
//   }
// }

// {loading ? (
//   <Stack.Screen name="Splash" component={Splash} />
// ) : authenticated ? (
//   <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
// ) : (
//   <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
// )}

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

// console.log('AppNavigator: authenticated: ' + authenticated);
// console.log('AppNavigator: loading: ' + loading);
// console.log('AppNavigator: paired: ' + paired);

//Validate and decode useEffect()
// useEffect(() => {
//   console.log(
//     'AppNavigator: [validateDecode]useEffect: context token: ' + token,
//   );
//   if (!!userToken) {
//     console.log('userToken!');
//     const decodedToken = jwtDecode(userToken);
//     if (decodedToken.exp * 1000 < Date.now()) {
//       signOut(userDispatch);
//       console.log('signOut');

//       // TODO: Go to login or welcome...
//       // window.location.href = '/login';
//     } else {
//       // console.log('AppNavigator: validateToken call');
//       // saveUserToken(userDispatch, userToken);
//       // axios.defaults.headers.common['Authorization'] = token;
//       // getUser(userDispatch, 'diegovfeder@gmail.com', userToken);
//     }
//   }
// }, [authenticated]);
