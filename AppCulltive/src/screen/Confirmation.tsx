import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import ConfirmationUndraw from '../../assets/undraw/confirmation.svg';

const Confirmation: React.FC = () => {
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
        <Text style={someStyles.h2}>
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
          // openSettings().catch(() => console.warn('cannot open settings'));
          // delete all stack trace and navigate to Home
          // set asyncStorage pairedDevice state -> synced with AppNavigator triggers a change from PairNavigator to HomeNavigator
          // set paired as true;
          // navigation.navigate('Home');
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Confirmation;
