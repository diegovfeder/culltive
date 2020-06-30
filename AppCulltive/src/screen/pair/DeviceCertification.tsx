import React, {useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {StackActions, useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import DeviceVerificationUndraw from '../../../assets/undraw/deviceVerification.svg';

const DeviceCertification: React.FC = () => {
  console.log('-- DeviceCertification.tsx');

  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={someStyles.h1}>Conecte seu dispositivo</Text>
      <Text style={someStyles.h3}>
        - Verifique se ele está conectado na tomada.{'\n'}- Aguarde cerca de 45
        segundos para que o dispositivo seja completamente iniciado.
      </Text>
      <DeviceVerificationUndraw
        width={320}
        height={320}
        style={{alignSelf: 'center'}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignSelf: 'center'}}>
          <Text
            style={[
              someStyles.textButton,
              {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
            ]}>
            Voltar
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          onPress={() => {
            navigation.dispatch(StackActions.replace('WiFiCredentials'));
          }}
          style={someStyles.button}>
          <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
            Continuar
          </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export default DeviceCertification;