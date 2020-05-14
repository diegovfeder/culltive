import React, {useEffect, useState} from 'react';

import {
  AsyncStorage,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import axios from 'axios';

// TODO: try below lib after system is manually working / pairing
import WifiManager from 'react-native-wifi-reborn';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import CircuitUndraw from '../../assets/undraw/circuit.svg';

const ConnectDevice: React.FC = () => {
  const navigation = useNavigation();
  const [ssid, setSsid] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState();

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@ssid');
      if (value !== null) {
        console.log('@ssid: ' + value);
        setSsid(value);
      } else {
        console.log('@ssid == null // no data');
      }
    } catch (e) {
      console.log(e.error);
    }
    try {
      const value = await AsyncStorage.getItem('@password');
      if (value !== null) {
        console.log('@password: ' + value);
        setPassword(value);
      } else {
        console.log('@password == null // no data');
      }
    } catch (e) {
      console.log(e.error);
    }
    try {
      const value = await AsyncStorage.getItem('@user');
      if (value !== null) {
        console.log('@user: ' + value);
        setUser(value);
      } else {
        console.log('@user == null // no data');
      }
    } catch (e) {
      console.log(e.error);
    }
    try {
      const value = await AsyncStorage.getItem('@WIFI');
      if (value !== null) {
        console.log('@WIFI: ' + value);
        // setWIFI(value);
      } else {
        console.log('@WIFI == null // no data');
      }
    } catch (e) {
      console.log(e.error);
    }
  };

  // TODO: Change data sent to Wi-Fi Crendetials Inputs + userContext + geoLocation
  // const _sendData = () => {
  //   console.log('ConnectDevice: sendData()');
  //   const instance = axios.create({
  //     baseURL: 'http://192.168.11.4/post',
  //   });
  //   instance
  //     .post('http://192.168.11.4/post', {
  //       ssid: ssid,
  //       password: password,
  //       assignedUser: 'diegovfeder', //get userData context etc.
  //     })
  //     .then(
  //       (response) => {
  //         console.log(response);
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //     );
  // };

  useEffect(() => {
    _retrieveData();

    WifiManager.getCurrentWifiSSID().then(
      (ssid) => {
        console.log('Your current connected wifi SSID is ' + ssid);
      },
      () => {
        console.log('Cannot get current SSID!');
      },
    );

    // TODO: Connect to qr-code scanned Wi-Fi or automatic scan and connect to a culltiveXXX network...
    // WifiManager.connectToProtectedSSID(
    //   'culltiveXXX',
    //   'culltive.me',
    //   false,
    // ).then(
    //   () => {
    //     console.log('Connected successfully!');
    //   },
    //   () => {
    //     console.log('Connection failed!');
    //   },
    // );
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
        <Text style={[someStyles.h1, {color: '#3cbc40'}]}>
          Connectar ao dispositivo
        </Text>
      </View>

      <CircuitUndraw width={320} height={320} style={{alignSelf: 'center'}} />

      <TouchableOpacity
        onPress={() => {
          // _sendData();

          axios.get('http://192.168.11.4/').then(
            (response) => {
              console.log(response);
            },
            (error) => {
              console.log(error);
            },
          );

          axios
            .post('http://192.168.11.4/credentials', {
              ssid: ssid,
              password: password,
              assignedUser: 'diegovfeder', //get userData context etc.
            })
            .then(
              (response) => {
                console.log(response);
              },
              (error) => {
                console.log(error);
              },
            );
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Enviar dados</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // async () => {
          //   // Open the custom settings if the app has one
          //   await Linking.openSettings();
          // };
        }}
        style={someStyles.button}>
        <Text style={[someStyles.textButton]}>Menu WiFi Config</Text>
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

// const storeData = async () => {
//   try {
//     await AsyncStorage.setItem('@DeviceToken', 'culltiveXXX');
//   } catch (e) {
//     console.log(e.error);
//   }
// };

// Get all WiFiCredentials related values
// multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
// const getAsyncStorage = async () => {
//   AsyncStorage.getAllKeys((err, keys) => {
//     AsyncStorage.multiGet(keys, (err, stores) => {
//       stores.map((result, i, store) => {
//         // get at each store's key/value so you can work with it
//         let key = store[i][0];
//         let value = store[i][1];
//         console.log(key + ' - ' + value);
//       });
//     });
//   });
// };
