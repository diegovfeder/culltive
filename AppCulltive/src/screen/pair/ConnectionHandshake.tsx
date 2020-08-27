import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// navigation
import {
  CommonActions,
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import axios from 'axios';
// import api from '../../util/api';
import WifiManager from 'react-native-wifi-reborn';

// Hooks
import {useUserState} from '../../context/UserContext';

// Assets
import {someStyles} from '../../Styles';
import {someColors} from '../../Colors';
import WifiUndraw from '../../../assets/undraw/interfaceWifi.svg';
import DeviceVerificationUndraw from '../../../assets/undraw/deviceVerification.svg';
import * as Svg from 'react-native-svg';

interface IUser {}

//TODO: setTimeout for connectionStates
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

  // State machine connection flags
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [done, setDone] = useState(false);

  // userContext
  //TODO: Ask on how to infer Types <IUser> in context hooks
  const {user} = useUserState();
  //TODO: validateUser, certify if user.email is not empty

  // Receive values from WifiCredentials route.
  const {ssid, password} = route.params;

  //Receive deviceId from Esp8266
  const [deviceId, setDeviceId] = useState('');

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

  // Checks if connected to proper esp8266 SOFT AP Wi-Fi
  useEffect(() => {
    WifiManager.getCurrentWifiSSID().then(
      (connectedSsid) => {
        console.log(
          'ConnectionHandshake: Your current connected wifi SSID is ' +
            connectedSsid,
        );
        //FIXME: includes 'culltive' in ssid is not the best validator but works for now...
        if (connectedSsid.includes('CULLTIVE')) {
          // Enable connecting flag to start connectionHandshake state machine
          setConnecting(true);
        } else {
          setConnecting(false);
        }
      },
      () => {
        console.log('ConnectionHandshake: Cannot get current SSID!');
      },
    );
  }, [appState]);

  // Post credentials to esp8266 Web Server
  useEffect(() => {
    console.log('useEffect() connecting: ' + connecting.toString());
    //TODO: Only post values to /credentials if ssid / password / user !== ""
    if (connecting) {
      console.log('axios.post(http://192.168.11.4/credentials): ');
      axios
        .post('http://192.168.11.4/credentials', {
          ssid: ssid,
          password: password,
          user: user?.email,
        })
        .then(
          (res) => {
            console.log(res);
            if (res.status === 200) {
              // Esp8266 received the proper data and returned 200.
              // connection STATE is validatingCredentials
              console.log('Credentials succesfully sent to esp8266');
              setStatusSubtitle('Validando credenciais enviadas...');
              setValidating(true);
            } else if (res.status === 400) {
              console.log('400 Bad Request');
            } else if (res.status === 401) {
              console.log('401 Missing Credentials');
            } else {
              console.log('Unfamiliar response: ' + res);
            }
            //TODO: If res.status !== 200 navigate to Fail
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
      console.log(
        'TODO: User should be guided to connect to esp8266 soft ap...',
      );
    }
  }, [connecting]);

  // Get validation response from esp8266
  useEffect(() => {
    console.log(
      'useEffect() connecting: ' +
        connecting.toString() +
        ' | validating: ' +
        validating.toString(),
    );
    if (connecting && validating) {
      axios.get('http://192.168.11.4/validation').then(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            //TODO: handle connection success / credentials verified...
            console.log('Credentials validation: ');
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
            } else {
              // credentials is ""
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Fail', params: {error: 'Credentials'}}],
                }),
              );
            }
          } else if (res.status === 400) {
            console.log('400 Bad Request');
          } else {
            console.log('Unfamiliar response: ' + res);
          }
          //TODO: If res.status !== 200 navigate to Fail
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
      console.log('TODO: else? handle connecting && validating...');
    }
  }, [validating]);

  // Credentials validated! Next state is verify connection to the internet...
  useEffect(() => {
    console.log('useEffect() validated: ' + validated.toString());
    if (validated) {
      axios.get('http://192.168.11.4/connection').then(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            console.log('Connection verification: ');
            console.log('res.data: ' + JSON.stringify(res.data));

            const {connection} = res.data;

            // Receivied deviceId as response from ESP8266
            console.log('res.data.deviceId: ' + res.data.deviceId);
            setDeviceId(res.data.deviceId);
            console.log('deviceId: ' + deviceId);

            if (connection === 'SUCCESS') {
              setStatusSubtitle(
                'Conexão verificada.\nEfetivando pareamento...',
              );

              setPairing(true);
              // setConnected(true);
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

  // This state verifies if device was posted to firestore
  useEffect(() => {
    console.log('useEffect() pairing: ' + pairing.toString());
    if (pairing) {
      axios.get('http://192.168.11.4/paired').then(
        (res) => {
          // console.log(res);
          if (res.status === 200) {
            console.log('http://192.168.11.4/paired return 200');
            console.log('res.data: ' + JSON.stringify(res.data));
            // Receivied boolean pairedState as response from ESP8266
            const {paired} = res.data;

            // I was thinking to compared user/device with esp8266deviceId to verify postDevice
            // but that would be very difficult as it would need to disconnect from esp8266
            // reconnect to Wi-Fi and then get data... So I will leave the pairing like this as it is...

            if (paired === true) {
              setStatusSubtitle('Dispositivo pareado!');
              setConnected(true);
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Fail', params: {error: 'Connection'}}],
                }),
              );
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
      console.log('Paired: ' + pairing);
    }
  }, [pairing]);

  // This is the last state, pairing confirmed!
  useEffect(() => {
    console.log('Connected: ' + connected.toString());
    if (connected) {
      setStatusSubtitle('Pareamento concluido com sucesso!');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Confirmation', params: {device: {deviceId}}}],
        }),
      );
    } else {
      console.log('Connected: ' + connected);
    }
  }, [connected]);

  return (
    <>
      {connecting ? (
        <SafeAreaView style={[someStyles.container_spaced]}>
          <View>
            <Text
              style={[
                someStyles.h1,
                someColors.tertiary,
                {
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                },
              ]}>
              Emparelhando dispositivo
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
            animating={connecting} //connecting && !connected
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
            <Text style={[someStyles.h1, someColors.tertiary]}>
              Enviar credenciais
            </Text>
            <Text style={[someStyles.h3]}>
              1- Abra o menu de configurações Wi-Fi{'\n'}
              2- Conecte-se a rede 'culltive.me'{'\n'}
              3- Volte para esta tela
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
