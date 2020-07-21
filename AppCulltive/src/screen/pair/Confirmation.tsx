import React, {useEffect, useState} from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// Navigation
import {StackActions, useNavigation} from '@react-navigation/native';

// Context
import {
  useDeviceDispatch,
  storeDeviceToken,
  setDeviceName,
} from '../../context/DeviceContext';
import {useDeviceState} from '../../context/DeviceContext';

// Assets
import {someStyles} from '../../Styles';
import {someColors} from '../../Colors';
import ConfirmationUndraw from '../../../assets/undraw/confirmation.svg';
import * as Svg from 'react-native-svg';

const Confirmation: React.FC = ({nav, route}) => {
  console.log('-- Confirmation.tsx');

  const {device} = route.params;
  console.log('deviceId: ' + device.deviceId);

  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  console.log('paired = ' + paired);

  useEffect(() => {
    if (device.deviceId !== '') {
      if (device.deviceId.includes('CULLTIVE')) {
        //FIXME:
        // setDeviceName(deviceDispatch, device.deviceId);
        console.log('storeDeviceToken: ' + device.deviceId);
        storeDeviceToken(deviceDispatch, device.deviceId);
      }
    } else {
      console.log('ERROR: Device is empty?..');
    }
  }, [device]);

  return (
    <SafeAreaView style={[someStyles.container_spaced]}>
      <View>
        <Text style={[someStyles.h1, someColors.secondary]}>Parabéns</Text>
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
