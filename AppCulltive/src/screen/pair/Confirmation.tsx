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
  validateDeviceToken,
} from '../../context/DeviceContext';
import {useDeviceState} from '../../context/DeviceContext';

// Styles
import {someStyles} from '../../Styles';

// Assets
import * as Svg from 'react-native-svg';
import ConfirmationUndraw from '../../../assets/undraw/confirmation.svg';

const Confirmation: React.FC = () => {
  console.log('-- Confirmation.tsx');

  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  console.log('paired = ' + paired);

  const storeDeviceToken = async (value) => {
    try {
      console.log('storeDeviceToken: ' + value);
      AsyncStorage.setItem('@deviceToken', value);
    } catch (e) {
      console.log(e.error);
    }
  };

  // TODO: join user and device with respective id's at firestore
  //FIXME: token is 'true' -> set this to culltive product id??

  useEffect(() => {
    console.log('setDeviceToken: true');
    storeDeviceToken('true');
    validateDeviceToken(deviceDispatch, 'true');
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
