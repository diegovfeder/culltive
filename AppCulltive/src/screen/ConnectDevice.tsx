import React, {useEffect, useState} from 'react';

import {
  AsyncStorage,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import WifiManager from 'react-native-wifi-reborn';

import {useNavigation} from '@react-navigation/native';

import {someStyles} from '../Styles';

const ConnectDevice: React.FC = () => {
  const navigation = useNavigation();

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@DeviceToken', 'culltiveXXX');
    } catch (e) {
      console.log(e.error);
    }
  };

  // useEffect(() => {
  //   //change (ssid, password, isWep)
  //   WifiManager.connectToProtectedSSID('culltiveXXX', 'W_project', false).then(
  //     () => {
  //       console.log('Connected successfully!');
  //     },
  //     () => {
  //       console.log('Connection failed!');
  //     },
  //   );
  // }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={[someStyles.h1, {color: '#3cbc40'}]}>
          Connectar ao dispositivo
        </Text>
      </View>

      <TouchableOpacity onPress={() => {}} style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConnectDevice;
