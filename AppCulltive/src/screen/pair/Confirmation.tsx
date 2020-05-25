import React, {useEffect, useState} from 'react';

import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// TODO: Import Device Context // setPaired

// Styles
import {someStyles} from '../../Styles';

// Assets
import ConfirmationUndraw from '../../../assets/undraw/confirmation.svg';

const Confirmation: React.FC = () => {
  console.log('-- Confirmation.tsx');

  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={[someStyles.h1, {color: '#3cbc40'}]}>Parabéns!</Text>
        <Text style={someStyles.h3}>
          {' '}
          Seu dispositivo foi conectado com sucesso.
        </Text>
      </View>

      <ConfirmationUndraw
        width={320}
        height={320}
        style={{alignSelf: 'center'}}
      />

      <TouchableOpacity
        onPress={() => {
          // Set pairedDevice = true
          // Connect user and device with id @firestore
          // ...
          navigation.navigate('DataAgreements');
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Confirmation;
