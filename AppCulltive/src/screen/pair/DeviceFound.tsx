import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import SearchingDeviceUndraw from '../../assets/undraw/searchingDevice.svg';

const DeviceFound: React.FC = () => {
  console.log('-- DeviceFound.tsx');

  const navigation = useNavigation();

  useEffect(() => {
    // TODO: some service that looks for devices ssid:(culltiveXXX)
    // save all these found devices in app context?..
    // if none are find go to DeviceNotFound.tsx
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={someStyles.h1}>Procurando dispositivos...</Text>
      <SearchingDeviceUndraw
        width={320}
        height={320}
        style={{alignSelf: 'center'}}
      />
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

export default DeviceFound;
