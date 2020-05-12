import React, {useEffect, useState} from 'react';

import {
  AsyncStorage,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import axios from 'axios';

// TODO: try below lib after system is manually working / pairing
// import WifiManager from 'react-native-wifi-reborn';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import CircuitUndraw from '../../assets/undraw/circuit.svg';

const ConnectDevice: React.FC = () => {
  const navigation = useNavigation();

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@DeviceToken', 'culltiveXXX');
    } catch (e) {
      console.log(e.error);
    }
  };

  // TODO: Change data sent to Wi-Fi Crendetials Inputs + userContext + geoLocation
  const sendData = () => {
    axios
      .post('http://192.168.11.4/post', {
        ssid: 'GRIFETES',
        password: 'senhadowifi',
        assignedUser: 'diegovfeder',
      })
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        },
      );
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

      <CircuitUndraw width={320} height={320} style={{alignSelf: 'center'}} />

      <TouchableOpacity
        onPress={() => {
          sendData();
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Enviar dados</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConnectDevice;

// val bodyJson = "{ \"ssid\" : \"$editTextWifiSSID\", \"pw\" : \"$editTextWiFiPassword\", \"qr\" : \"$sharedPrefsQQCode\"  }"
// val (request, response, result) = Fuel.post("http://192.168.11.4/post")
//   .body(bodyJson)
//   .response()
//
// when (result) {
//   is Result.Failure -> {
//     val ex = result.getException()
//     println(ex)
//     Toast.makeText(this, request.toString(), Toast.LENGTH_LONG).show()
//     Toast.makeText(this, response.toString(), Toast.LENGTH_LONG).show()
//     Toast.makeText(this, result.toString(), Toast.LENGTH_LONG).show()
//     Log.i(TAG, result.toString())
//   }
//   is Result.Success -> {
//     val data = result.get()
//     println(data)
//     Toast.makeText(this, "200 - OK", Toast.LENGTH_LONG).show()
//     val intent = Intent(applicationContext, GettingReadyActivity::class.java)
//     startActivity(intent)
//   }
// }
// todo: Check if Wi-Fi credentials are fine and go to next activity
