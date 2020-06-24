import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  AppState,
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

const GrantPermissions: React.FC = ({nav, route}) => {
  console.log('-- GrantPermissions.tsx');
  const navigation = useNavigation();

  //TODO: Receive params from check in Home.tsx and act accordingly
  const [permissionState, setPermissionState] = useState('');
  console.log('route.params... ' + route.params.permissions);

  // Manages appState (onFocus / onBackground)
  //FIXME: appState is glitching navigation
  const [appState, setAppState] = useState(AppState.currentState);
  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

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
          console.log('unavailable');
          setPermissionState('unavailable');
          //Then?
          break;
        case 'denied':
          console.log('denied');
          setPermissionState('denied');
          //Ask again?
          break;
        case 'blocked':
          console.log('blocked');
          setPermissionState('blocked');
          break;
        case 'granted':
          console.log('granted');
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
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: 6,
            minHeight: 48,
          }}>
          <Text
            style={[
              someStyles.textButton,
              {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
            ]}>
            Voltar
          </Text>
        </TouchableOpacity>
        {/* TODO: OpenSettingsButton should only toggle if permissions are Blocked. */}
        {/* TODO: Also, the header Text should change for different states */}
        {route.params.permissions === 'blocked' ||
        permissionState === 'blocked' ? (
          <OpenSettingsButton />
        ) : (
          <></>
        )}
        {/* <OpenSettingsButton /> */}
      </View>
    </SafeAreaView>
  );
};

export default GrantPermissions;
