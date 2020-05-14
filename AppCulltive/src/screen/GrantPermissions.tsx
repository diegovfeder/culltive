import React, {useEffect, useState} from 'react';
import {
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

  useEffect(() => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );

    // FIXME: Simplify code below with select as switch statement.
    // Platform.select({
    //   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    // }),

    // TODO: Switch console.log() to state logic -> navigating to screens (Verify Permissions)
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION');
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
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then((result) => {
        console.log('PERMISSIONS.IOS.LOCATION_ALWAYS');
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
          openSettings().catch(() =>
            console.warn('GrantPermissions: Cannot open settings'),
          );
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Abrir configurações</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WiFiCredentials');
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WiFiCredentials');
          }}
          style={someStyles.button}>
          <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GrantPermissions;
