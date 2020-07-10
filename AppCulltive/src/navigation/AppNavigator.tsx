import React, {useEffect, useState} from 'react';
import {AsyncStorage} from 'react-native';

// User Context
import {
  useUserDispatch,
  useUserState,
  signOut,
  getAuthenticatedUser,
  setLoadingUser,
  storeUserToken,
} from '../context/UserContext';

// Device Context
import {
  useDeviceDispatch,
  useDeviceState,
  setLoadingDevice,
  storeDeviceToken,
  getDevice,
} from '../context/DeviceContext';

//Screens || Navigators
import SplashNavigator from './SplashNavigator';
import AuthNavigator from './AuthNavigator';
import {DrawerNavigator} from './DrawerNavigator';

// Decode Firebase auth token
import jwtDecode from 'jwt-decode';

const AppNavigator: React.FC = () => {
  console.log('... AppNavigator.tsx ...');

  // let appDispatch = useAppDispatch(); // ?

  let userDispatch = useUserDispatch();
  let {loading: loadingUser, authenticated, authToken, user} = useUserState();
  let userToken: string | null;

  let deviceDispatch = useDeviceDispatch();
  let {loading: loadingDevice, paired, pairToken, device} = useDeviceState();
  let deviceToken: string | null;

  // Initial Loading State ==>  SplashScreen
  const [loading, isLoading] = useState(true);
  useEffect(() => {
    isLoading(loadingUser || loadingDevice);
  }, [loadingUser, loadingDevice]);

  //printAll()
  useEffect(() => {
    console.log('* AppNavigator:');
    console.log('authenticated: ' + authenticated);
    console.log('authToken: ' + authToken);
    console.log('paired: ' + paired);
    console.log('pairToken: ' + paired);
    console.log('loadingUser: ' + loadingUser);
    console.log('user: ' + JSON.stringify(user));
    console.log('loadingDevice: ' + loadingDevice);
    console.log('device: ' + JSON.stringify(device));
  }, [authenticated, authToken, paired, pairToken, user, device]);

  // ** USER AUTH TOKEN
  // Recover asyncStorage token, decode it and verify if it's valid.
  useEffect(() => {
    const validateToken = async () => {
      try {
        userToken = await AsyncStorage.getItem('@authToken');
        if (userToken === null) {
          setLoadingUser(userDispatch, false);
        } else {
          const decodedToken = jwtDecode(userToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            signOut(userDispatch);
          } else {
            storeUserToken(userDispatch, userToken);
            getAuthenticatedUser(userDispatch);
          }
        }
      } catch (e) {
        console.log('AppNavigator: Restoring @authToken failed: ' + e);
      }
    };
    validateToken();
  }, []);

  // ** DEVICE PAIR TOKEN
  // Recover asyncStorage token, decode it and verify if it's valid.
  useEffect(() => {
    const validateToken = async () => {
      try {
        deviceToken = await AsyncStorage.getItem('@pairToken');
        if (deviceToken === null) {
          console.log('|| deviceToken == null');
          setLoadingDevice(deviceDispatch, false);
        } else {
          getDevice(deviceDispatch, deviceToken);
          if (device.deviceId !== deviceToken) {
            console.log('deviceToken failed to pass decode => not paired...');
            //Do something??
          } else {
            console.log('deviceToken is valid => paired...');
            storeDeviceToken(deviceDispatch, deviceToken);
          }
        }
      } catch (e) {
        console.log('AppNavigator: Restoring @deviceToken failed: ' + e);
      }
    };
    validateToken();
  }, []);

  return (
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
