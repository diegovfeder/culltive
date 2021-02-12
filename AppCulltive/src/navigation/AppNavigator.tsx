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

  let userDispatch = useUserDispatch();
  let {authenticated, authToken, user} = useUserState();
  let userToken: string | null;

  let deviceDispatch = useDeviceDispatch();
  let {paired, pairToken, device} = useDeviceState();
  let deviceToken: string | null;

  // Initial Loading State ==>  SplashScreen
  const [loading, isLoading] = useState(true);
  const [loadingUser, isLoadingUser] = useState(true);
  const [loadingDevice, isLoadingDevice] = useState(true);

  // ** USER AUTH TOKEN
  // Recover asyncStorage token, decode it and verify if it's valid.
  useEffect(() => {
    let mounted = true;
    isLoadingUser(true);

    const validateToken = async () => {
      if (mounted) {
        try {
          userToken = await AsyncStorage.getItem('@authToken');
          if (userToken === null) {
            isLoadingUser(false);
          } else {
            const decodedToken = jwtDecode(userToken);
            if (decodedToken.exp * 1000 < Date.now()) {
              // The * 1000 refers to amount of time
              // check what decodedToken is
              console.log(JSON.stringify(decodedToken));
              console.log(decodedToken.exp);
              isLoadingUser(true);
              signOut(userDispatch);
              isLoadingUser(false);
            } else {
              storeUserToken(userDispatch, userToken, isLoadingUser);
              getAuthenticatedUser(userDispatch);
              isLoadingUser(false);
            }
          }
        } catch (err) {
          console.log('AppNavigator: Restoring @authToken failed: ' + err);
          isLoadingUser(false);
        }
      }
    };

    validateToken();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  // ** DEVICE PAIR TOKEN
  // Recover asyncStorage token, decode it and verify if it's valid.
  useEffect(() => {
    let mounted = true;
    isLoadingDevice(true);

    const validateToken = async () => {
      if (mounted) {
        try {
          deviceToken = await AsyncStorage.getItem('@pairToken');
          if (deviceToken === null) {
            isLoadingDevice(false);
          } else {
            getDevice(deviceDispatch, deviceToken);
            //TODO: Validation
            if (device.deviceId !== deviceToken) {
              console.log('pairToken failed to pass decode => not paired...');
              isLoadingDevice(false);
            } else {
              console.log('pairToken is valid => paired...');
              storeDeviceToken(deviceDispatch, deviceToken);
              setTimeout(() => {
                isLoadingDevice(false);
              }, 2000);
            }
          }
        } catch (e) {
          console.log('AppNavigator: Restoring @pairToken failed: ' + e);
          isLoadingDevice(false);
        }
      }
    };

    validateToken();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    isLoading(loadingUser || loadingDevice);
    // TODO: setTimeout isLoading(false)
  }, [loadingUser, loadingDevice]);

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

//printAll()
// useEffect(() => {
//   console.log('* AppNavigator:');
//   console.log('authenticated: ' + authenticated);
//   console.log('authToken: ' + authToken);
//   console.log('paired: ' + paired);
//   console.log('pairToken: ' + pairToken);
//   console.log('loadingUser: ' + loadingUser);
//   console.log('user: ' + JSON.stringify(user));
//   console.log('loadingDevice: ' + loadingDevice);
//   console.log('device: ' + JSON.stringify(device));
//   console.log('* loading: ' + loading);
// }, [
//   authenticated,
//   authToken,
//   paired,
//   pairToken,
//   loadingUser,
//   user,
//   loadingDevice,
//   device,
//   loading,
// ]);
