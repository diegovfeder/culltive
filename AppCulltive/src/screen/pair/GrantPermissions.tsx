import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Button,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  check,
  openSettings,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import * as Svg from 'react-native-svg';

import {StackActions, useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import LocationUndraw from '../../../assets/undraw/location.svg';

{
  /*  */
}

const OpenSettingsButton = () => {
  const handlePress = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  return (
    <TouchableHighlight
      underlayColor="#3ea341"
      activeOpacity={1}
      onPress={handlePress}
      style={someStyles.button}>
      <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
        Abrir configurações
      </Text>
    </TouchableHighlight>
  );
};

// TODO: If permissions are granted, this page should not even be loaded...

const GrantPermissions: React.FC = ({nav, route}) => {
  console.log('-- GrantPermissions.tsx');

  //TODO: Receive params from check in Home.tsx and act accordingly
  // console.log('route.params...' + route.params.screen);

  const navigation = useNavigation();

  // TODO: feat (permissionsGranted) -> Verify state, re-direct user accordingly
  // TODO: Switch console.log() to state logic -> navigating to screens (Verify Permissions)
  // FIXME: Simplify code below with select as switch statement.
  useEffect(() => {
    setTimeout(requestPermissions, 1000);
  });

  const requestPermissions = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then((res: string) => {
      console.log('useEffect: requestPermissions (callback)');
      //TODO: Handle permissions states.
      switch (res) {
        case 'unavailable':
          console.log('Unavailable');
          setPermissionState('Unavailable');
          //Then?
          break;
        case 'denied':
          console.log('Denied');
          setPermissionState('Denied');
          //Ask again?
          break;
        case 'blocked':
          console.log('Blocked');
          setPermissionState('Blocked');
          break;
        case 'granted':
          console.log('Granted');
          navigation.dispatch(StackActions.replace('DeviceCertification'));
          break;
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={someStyles.h1}>Acesso local</Text>
      <Text
        style={[
          someStyles.h3,
          {
            textAlign: 'center',
          },
        ]}>
        Permita o acesso à localização nas configurações do seu telefone para
        configurar e gerenciar dispositivos próximos.
      </Text>
      <LocationUndraw width={320} height={320} style={{alignSelf: 'center'}} />
      {/* FIXME: enable this button ONLY if permissions is denied or something... */}
      {/* <TouchableOpacity
        onPress={() => {
          console.log('GrantPermissions: openSettings()');
          openSettings().catch(() =>
            console.warn('GrantPermissions: Cannot open settings'),
          );
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Abrir configurações</Text>
      </TouchableOpacity> */}
      <View
        style={{
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            // TODO: go to HomeScreen but without paired?
            // goes to hasAccount, notPairedDeviceScreen?
            // create a screen for that transitory State
            // navigation.navigate('Home0');
          }}
          style={{alignSelf: 'center'}}>
          <Text
            style={[
              someStyles.textButton,
              {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
            ]}>
            Voltar
          </Text>
        </TouchableOpacity>
        <OpenSettingsButton />
      </View>
    </SafeAreaView>
  );
};

export default GrantPermissions;
