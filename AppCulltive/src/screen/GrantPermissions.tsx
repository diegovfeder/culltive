import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// TODO: iOS ->
// Permissions
import {
  check,
  openSettings,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import LocationUndraw from '../../assets/undraw/location.svg';

const GrantPermissions: React.FC = () => {
  const navigation = useNavigation();
  // TODO: feat (permissionsGranted) -> Verify state, re-direct user accordingly

  // useEffect(() => {
  //   const permissionsAsync = async () => {
  //     try {
  //       let granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location permission is required for WiFi connections',
  //           message:
  //             'This app needs location permission as this is required  ' +
  //             'to scan for wifi networks.',
  //           buttonNegative: 'DENY',
  //           buttonPositive: 'ALLOW',
  //         },
  //       );
  //       console.log('GrantPermissions: granted');
  //     } catch (e) {
  //       console.log('GrantPermissions: error');
  //     }
  //   };
  //   permissionsAsync();
  // }, []);

  useEffect(() => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );

    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        // …
      });
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={someStyles.h1}>Acesso local</Text>
      <Text style={someStyles.h3}>
        Permita o acesso à localização nas configurações do seu telefone para
        configurar e gerenciar dispositivos próximos.
      </Text>
      <LocationUndraw width={320} height={320} style={{alignSelf: 'center'}} />
      <TouchableOpacity
        onPress={() => {
          // openSettings().catch(() => console.warn('cannot open settings'));
          navigation.navigate('WiFiCredentials');
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Abrir configurações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GrantPermissions;
