import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Button,
  Linking,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import axios from 'axios';

// TODO: Try below lib after system is manually working / pairing
import WifiManager from 'react-native-wifi-reborn';

import {
  CommonActions,
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import DeviceVerificationUndraw from '../../../assets/undraw/deviceVerification.svg';
import WifiUndraw from '../../../assets/undraw/interfaceWifi.svg';

import {useUserState} from '../../context/UserContext';

//TODO: Finish logic
enum Status {
  waitingForConnection,
  sendingCredentials,
  waitingForAck,
}

//TODO: handle 3g connection bug -> make sure App is sending data to Esp8266 SoftAP (IP)

const OpenWifiButton = ({action}) => {
  const handlePress = useCallback(async () => {
    try {
      await Linking.sendIntent(action);
    } catch (e) {
      console.log('Error: ' + e);
    }
  }, [action]);

  return (
    <TouchableHighlight
      underlayColor="#3ea341"
      activeOpacity={1}
      onPress={handlePress}
      style={someStyles.button}>
      <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
        Menu Wi-Fi
      </Text>
    </TouchableHighlight>
  );
};

const ConnectionHandshake: React.FC = ({nav, route}) => {
  console.log('-- ConnectionHandshake.tsx');

  const navigation = useNavigation();

  const [statusSubtitle, setStatusSubtitle] = useState(
    'Enviando credenciais...',
  );
  const [connecting, setConnecting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [connected, setConnected] = useState(false);

  const {ssid, password} = route.params;

  //TODO: set and get user in AsyncStorage or getUserData from firebase...
  const {user} = useUserState();
  // console.log('user: ' + user);

  // Manages appState (onFocus / onBackground)
  const [appState, setAppState] = useState(AppState.currentState);
  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    WifiManager.getCurrentWifiSSID().then(
      (connectedSsid) => {
        console.log(
          'ConnectDevice: Your current connected wifi SSID is ' + connectedSsid,
        );
        if (connectedSsid.includes('culltive')) {
          setConnecting(true);
        } else {
          setConnecting(false);
        }
      },
      () => {
        console.log('ConnectDevice: Cannot get current SSID!');
      },
    );
  }, [appState]);

  useEffect(() => {
    if (connecting) {
      axios
        .post('http://192.168.11.4/credentials', {
          ssid: ssid,
          password: password,
          user: user,
        })
        .then(
          (res) => {
            console.log(res);
            if (res.status === 200) {
              console.log('Credentials succesfully sent to esp8266');
              setStatusSubtitle('Validando credenciais enviadas...');
              setValidating(true);
            } else if (res.status === 400) {
              console.log('400 Bad Request');
            } else {
              console.log('Unfamiliar response: ' + res);
            }
          },
          (err) => {
            console.log('ERROR: ' + JSON.stringify(err));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Fail', params: {error: JSON.stringify(err)}}],
              }),
            );
          },
        );
    } else {
      console.log('Connecting: ' + connecting);
    }
  }, [connecting]);

  useEffect(() => {
    console.log(
      'Connecting: ' +
        connecting.toString() +
        ' | Validating: ' +
        validating.toString(),
    );
    if (connecting && validating) {
      axios.get('http://192.168.11.4/validation').then(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            //TODO: handle connection success / credentials verified...
            console.log('Got {credentials} values: ');
            console.log('res.data: ' + JSON.stringify(res.data));
            const {credentials} = res.data;
            if (credentials === 'VERIFIED') {
              setStatusSubtitle(
                'Credenciais validadas.\nVerificando conexão...',
              );
              setValidated(true);
            } else if (credentials === 'FAIL') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Fail', params: {error: 'Credentials'}}],
                }),
              );
              //...
            } else {
              //...
            }
          } else if (res.status === 400) {
            console.log('400 Bad Request');
          } else {
            console.log('Unfamiliar response: ' + res);
          }
        },
        (err) => {
          console.log('ERROR: ' + JSON.stringify(err));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Fail', params: {error: JSON.stringify(err)}}],
            }),
          );
        },
      );
    } else {
      console.log('Validating: ' + validating);
    }
  }, [validating]);

  useEffect(() => {
    console.log('Validated: ' + validated.toString());
    if (validated) {
      axios.get('http://192.168.11.4/connection').then(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            console.log('Got {connection} values: ');
            console.log('res.data: ' + JSON.stringify(res.data));
            const {connection} = res.data;
            if (connection === 'SUCCESS') {
              setStatusSubtitle(
                'Conexão verificada.\nRealizando ajustes finais...',
              );
              setConnected(true);
            } else if (connection === 'FAIL') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Fail', params: {error: 'Connection'}}],
                }),
              );
            } else {
              //TODO: Retry axios.get on connection in case res is "".
              // https://github.com/softonic/axios-retry
            }
          } else if (res.status === 400) {
            console.log('400 Bad Request');
          } else {
            console.log('Unfamiliar response: ' + res);
          }
        },
        (err) => {
          console.log('ERROR: ' + JSON.stringify(err));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Fail', params: {error: JSON.stringify(err)}}],
            }),
          );
        },
      );
    } else {
      console.log('Validated: ' + validated);
    }
  }, [validated]);

  useEffect(() => {
    console.log('Connected: ' + connected.toString());
    if (connected) {
      setStatusSubtitle('Pareamento concluido com sucesso!');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Confirmation'}],
        }),
      );
    } else {
      console.log('Connected: ' + connected);
    }
  }, [connected]);

  return (
    <>
      {connecting ? (
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 12,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={[
                someStyles.h1,
                {
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                },
              ]}>
              Estabelecendo vínculo com seu dispositivo culltive
            </Text>
            <Text
              style={[
                someStyles.h3,
                {
                  justifyContent: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                },
              ]}>
              {statusSubtitle}
            </Text>
          </View>
          <ActivityIndicator
            size={220}
            animating={connecting && !connected}
            color={'#3cbc40'}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{alignSelf: 'flex-start'}}>
            <Text
              style={[
                someStyles.textButton,
                {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
              ]}>
              Voltar
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 12,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={someStyles.h1}>Enviar credenciais</Text>
            <Text style={[someStyles.h3]}>
              1- Abra o menu de configurações Wi-Fi{'\n'}
              2- Conecte a rede 'culltive.me'{'\n'}
              3- Volte para a esta tela...
            </Text>
          </View>
          <WifiUndraw width={320} height={320} style={{alignSelf: 'center'}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
            <OpenWifiButton action="android.settings.WIFI_SETTINGS" />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default ConnectionHandshake;

//TODO: Send credentials, catch error (do something)
//      If alright (esp acks server)
//      If alright (app receive ack)
//      Then goes to next screen
// useEffect(() => {
//   if (connecting) {
//     axios
//       .post('http://192.168.11.4/credentials', {
//         ssid: ssid,
//         password: password,
//         user: userName,
//       })
//       .then(
//         (res) => {
//           console.log(res);
//           if (res.status === 200) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Confirmation'}],
//               }),
//             );
//           } else if (res.status === 400) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Fail', params: {error: 'Credentials'}}],
//               }),
//             );
//           } else {
//             console.log('RESPONSE: ' + res);
//           }
//         },
//         (err) => {
//           console.log('ERROR: ' + JSON.stringify(err));
//           navigation.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [{name: 'Fail', params: {error: err}}],
//             }),
//           );
//         },
//       );
//   } else {
//     console.log('Connecting: ' + connecting);
//   }
// }, [connecting]);

// console.log(userName)

// TODO: Connect to 'PRODUCT_ID' programatically:
// useEffect(() => {
//   WifiManager.connectToProtectedSSID('cultive000', 'culltive.me', true).then(
//     () => {
//       console.log('Connected successfully!');
//     },
//     () => {
//       console.log('Connection failed!');
//     },
//   );
// }, []);

// {/* <TouchableOpacity
//   onPress={() => {
//     navigation.dispatch(StackActions.replace('WiFiCredentials'));
//   }}
//   style={someStyles.button}>
//   <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
//     Continuar
//   </Text>
// </TouchableOpacity> */}

// useEffect(() => {
//   const unsubscribe = navigation.addListener('focus', () => {
//     WifiManager.getCurrentWifiSSID().then(
//       (connectedSsid) => {
//         console.log(
//           'ConnectDevice: Your current connected wifi SSID is ' +
//             connectedSsid,
//         );
//         if (connectedSsid.includes('culltive')) {
//           setConnecting(true);
//         } else {
//           setConnecting(false);
//         }
//       },
//       () => {
//         console.log('ConnectDevice: Cannot get current SSID!');
//       },
//     );
//   });
//   return unsubscribe;
// }, [navigation]);
