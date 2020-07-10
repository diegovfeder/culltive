import React, {useEffect, useState} from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {StackActions, useNavigation} from '@react-navigation/native';

// Context
import {
  useDeviceDispatch,
  storeDeviceToken,
  setDeviceName,
} from '../../context/DeviceContext';
import {useDeviceState} from '../../context/DeviceContext';

// Styles
import {someStyles} from '../../Styles';

// Assets
import * as Svg from 'react-native-svg';
import ConfirmationUndraw from '../../../assets/undraw/confirmation.svg';

const Confirmation: React.FC = ({nav, route}) => {
  console.log('-- Confirmation.tsx');

  const {device} = route.params;
  console.log('deviceId: ' + device);

  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  console.log('paired = ' + paired);

  useEffect(() => {
    if (device !== '') {
      if (device.includes('CULLTIVE')) {
        setDeviceName(deviceDispatch, device);
      }
    } else {
      console.log('device is empty');
    }
  }, [device]);

  useEffect(() => {
    console.log('setDeviceToken: true');
    storeDeviceToken(deviceDispatch, device.deviceId);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={[someStyles.h1, {color: '#3cbc40'}]}>Parabéns</Text>
        <Text style={[someStyles.h3, {textAlign: 'center'}]}>
          A conexão do seu dispositivo foi estabelecida com sucesso!
        </Text>
      </View>

      <ConfirmationUndraw
        width={320}
        height={320}
        style={{alignSelf: 'center'}}
      />

      <TouchableHighlight
        underlayColor="#3ea341"
        activeOpacity={1}
        onPress={() => {
          navigation.dispatch(StackActions.replace('DataAgreements'));
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Continuar</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

export default Confirmation;
