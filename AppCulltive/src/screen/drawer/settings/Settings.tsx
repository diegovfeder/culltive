import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';

// Contexts
import {
  useUserDispatch,
  useUserState,
  clearUserDevice,
} from '../../../context/UserContext';
import {
  useDeviceDispatch,
  useDeviceState,
  getDevice,
  getDeviceAction,
  postDeviceAction,
  deleteDevice,
  setDeviceAction,
  clearError,
} from '../../../context/DeviceContext';

// Components
// import {Divider, Slider} from 'react-native-elements';

// Assets
import {someStyles} from '../../../Styles';
import {someColors} from '../../../Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IDevice {
  deviceId: string;
  geolocation: string;
  productType: string;
  firmwareVersion: string;
}

// TODO: Finish this code...
const myDevice = ({deviceId}: any) => {
  useEffect(() => {
    const subscriber = firestore()
      .collection('devices')
      .doc(deviceId)
      .onSnapshot((documentSnapshot) => {
        console.log('Device data: ', documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [deviceId]);
};

const Settings: React.FC = () => {
  console.log('-- Settings.tsx');
  const navigation = useNavigation();

  const userDispatch = useUserDispatch();
  // const {user} = useUserState();

  const deviceDispatch = useDeviceDispatch();
  const {device, error: errorDevice, loading: loadingDevice} = useDeviceState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Refers to waterPump button activity indicator
  const [loadingWaterPump, setLoadingWaterPump] = useState(false);

  const [isLEDEnabled, setIsLEDEnabled] = useState(true);
  const [isLEDSwitchDisabled, setLEDSwitchDisabled] = useState(false);

  // const [automaticWatering, setAutomaticWatering] = useState(true);
  // const [sliderValue, setSliderValue] = useState(360);

  //FIXME: Validate data, handle this clutter of weird useEffects
  //TODO: GET DEVICE, STAY IN THE loadingState
  //WHEN LOADED UPDATE VALUES
  // useEffect(() => {
  //   getDeviceAction(deviceDispatch, device.deviceId);

  //   setIsLEDEnabled(device.action.ledTape);
  // }, [device]);

  // The following code means to validate errorDevice
  useEffect(() => {
    console.log('Settings -> errorDevice: ' + JSON.stringify(errorDevice));

    if (errorDevice !== null) {
      if (
        typeof errorDevice.from !== 'undefined' ||
        typeof errorDevice.from !== 'null'
      ) {
        console.log('is not undefined or null');
        if (errorDevice.from === 'postDeviceAction') {
          console.log('errorDevice from postDevice');
          //TODO: get response?
          // means action did not come from waterPump Button
          if (!loadingWaterPump) setIsLEDEnabled(!isLEDEnabled);
          setLoadingWaterPump(false);
          // toggleLEDSwitch(device.action.ledTape);
        }
      }
    }
    if (errorDevice !== null) {
      if (errorDevice.code === 500) {
        console.log('500 Network Error: ' + JSON.stringify(errorDevice));
        Alert.alert(
          'Ops...',
          'Erro de conexão, tente novamente.' +
            '\n\n' +
            errorDevice.err.message,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                clearError(deviceDispatch);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('Error.code == 500: ' + JSON.stringify(errorDevice));
        Alert.alert(
          'Ops...',
          'Erro de conexão, tente novamente.' +
            '\n\n' +
            errorDevice.err.message +
            ' from ' +
            errorDevice.from,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                // returnToOldState();
                clearError(deviceDispatch);
              },
            },
          ],
          {cancelable: false},
        );
        //...
      }
    } else {
      console.log('errorDevice === null');
    }
  }, [errorDevice]);

  // loadingDevice
  useEffect(() => {
    console.log('Settings -> device: ' + JSON.stringify(device));

    if (device.deviceId !== null || device.deviceId !== undefined) {
      setLoading(false);
    } else {
      // getDevice();
      //...
    }
  }, [device]);

  // printDevice
  useEffect(() => {
    console.log('deviceId: ' + device.deviceId);
    if (typeof device.deviceId === 'undefined') {
      console.log('haha');
    } else {
      console.log('hehe');
    }
  }, [device]);

  // set settings from device
  //TODO: verify keys
  useEffect(() => {
    console.log('useEffect(): device: ' + JSON.stringify(device));

    if (device !== {}) {
      console.log('got here...');

      if (typeof device.action !== 'undefined') {
        console.log('action !== undefined');
        if (typeof device.action.ledTape !== 'undefined') {
          console.log('ledTape !== undefined');
          setIsLEDEnabled(device.action.ledTape);
          console.log('didnt crash :)');
        }
      }
    } else {
      console.log('device.action.ledTape == undefined');
      //... get ledTape???
    }
  }, [device]);

  // Style React Navigation Header
  useEffect(() => {
    navigation.setOptions({
      title: 'Configurações',
      headerShown: true,
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Configurações</Text>
        </View>
      ),
      headerLeft: () => <DrawerButton />,
    });
  });

  const DrawerButton = (props: any) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Ionicons
            name="md-menu"
            style={someStyles.headerButton}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const toggleLEDSwitch = (currentState: boolean) => {
    console.log('toggleLEDSwitch: currentState: ' + currentState);
    console.log('toggleLEDSwitch: device: ' + JSON.stringify(device));

    //TODO: VALIDATE device.ation
    // if (device ), keys, etc...
    if (typeof device.action === 'undefined') {
      console.log('device.action IS NOT DEFINED!');
      getDeviceAction(deviceDispatch, device.deviceId);
    }

    let action = {};

    if (typeof device.action !== 'undefined') {
      action = {
        ledTape: currentState,
        waterPump: device.action.waterPump,
      };
    } else {
      console.log('device.action is undefined');
      action = {
        ledTape: currentState,
        waterPump: false,
      };
    }

    if (device.deviceId.includes('CULLTIVE')) {
      console.log('toggleLEDSwitch: ' + JSON.stringify(device));
      postDeviceAction(deviceDispatch, device.deviceId, action);
    } else {
      console.log('toggleLEDSwitch: (no device Id) ');
    }

    setIsLEDEnabled((previousState) => !previousState);
  };

  const toggleWaterPump = () => {
    setLEDSwitchDisabled(true);

    const action = {
      ledTape: isLEDEnabled,
      waterPump: true,
    };
    postDeviceAction(deviceDispatch, device.deviceId, action);

    setLoadingWaterPump(true);
    setTimeout(() => {
      setLEDSwitchDisabled(false);
      setLoadingWaterPump(false);
      setDeviceAction(deviceDispatch, {
        ledTape: device.action.ledTape,
        waterPump: false,
      });
    }, 5000);
  };

  // TODO: feature
  // const toggleAWSwitch = () =>
  //   setAutomaticWatering((previousState) => !previousState);

  const loadingContainer = (
    <View
      style={{
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <ActivityIndicator
        color={'#3cbc40'}
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );

  const errorContainer = (
    <View style={{padding: 2, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={[someStyles.h3, {fontSize: 20, textAlign: 'center'}]}>
        Falha ao carregar informações
      </Text>
      <Text
        style={[
          someStyles.h3,
          {marginVertical: 8, fontSize: 12, textAlign: 'center'},
        ]}>
        Verifique sua conexão com a internet.
      </Text>
    </View>
  );

  const accountContainer = (
    <View style={{alignItems: 'stretch', margin: 16}}>
      <View style={{flexDirection: 'row'}}>
        <Ionicons
          name="ios-contact"
          size={40}
          color="#353535"
          style={{marginRight: 12, alignSelf: 'center'}}
        />
        <Text
          style={[
            someStyles.h1,
            {fontWeight: '200', fontSize: 32, alignSelf: 'center'},
          ]}>
          Account
        </Text>
      </View>
      <View style={{flexDirection: 'column', marginHorizontal: 12}}>
        <Text
          style={[
            someStyles.h2,
            {color: '#AEB5BC', fontSize: 20, marginVertical: 8},
          ]}>
          Username:
        </Text>
        <Text
          style={[
            someStyles.h2,
            {color: '#AEB5BC', fontSize: 20, marginVertical: 8},
          ]}>
          Change Password:
        </Text>
        <Text
          style={[
            someStyles.h2,
            {color: '#AEB5BC', fontSize: 20, marginVertical: 8},
          ]}>
          Facebook:
        </Text>
      </View>
    </View>
  );

  const moreContainer = (
    <View style={{alignItems: 'stretch', margin: 16}}>
      <View style={{flexDirection: 'row'}}>
        <Ionicons
          name="ios-apps"
          size={40}
          color="#353535"
          style={{marginRight: 12, alignSelf: 'center'}}
        />
        <Text
          style={[
            someStyles.h2,
            {fontWeight: '200', fontSize: 32, alignSelf: 'center'},
          ]}>
          More
        </Text>
      </View>
      <View style={{flexDirection: 'column', marginHorizontal: 12}}>
        <Text
          style={[
            someStyles.h2,
            {color: '#AEB5BC', fontSize: 20, marginVertical: 8},
          ]}>
          Language:
        </Text>
      </View>
    </View>
  );

  return (
    <>
      {loading ? (
        loadingContainer
      ) : error ? (
        errorContainer
      ) : (
        <SafeAreaView style={[someStyles.container_header]}>
          <ScrollView>
            {/*ACCOUNT*/}
            {/* {accountContainer} */}
            {/* <Divider style={{margin: 8}} /> */}

            {/*DEVICE*/}
            <View
              style={{
                alignItems: 'stretch',
                marginVertical: 12,
                marginHorizontal: 4,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name="ios-settings"
                  size={40}
                  color="#353535"
                  style={{marginRight: 12, alignSelf: 'center'}}
                />
                <Text
                  style={[
                    someStyles.h3,
                    {
                      paddingBottom: 4,
                      color: '#4d4d5d',
                      fontWeight: '200',
                      fontSize: 32,
                      alignSelf: 'center',
                    },
                  ]}>
                  Dispositivo
                </Text>
              </View>

              <View style={{flexDirection: 'column', marginHorizontal: 12}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      someStyles.h3,
                      {color: '#AEB5BC', fontSize: 20, alignSelf: 'center'},
                    ]}>
                    Luz Artificial
                  </Text>
                  <Switch
                    style={{margin: 12}}
                    trackColor={{
                      true: '#3cbc40',
                      false: '#d3d3d3',
                    }}
                    thumbColor={'#fff'}
                    ios_backgroundColor="#d3d3d3"
                    onValueChange={(value) => toggleLEDSwitch(value)}
                    value={isLEDEnabled}
                    disabled={isLEDSwitchDisabled}
                  />
                </View>

                {/* TODO: Finish actions in automatic watering */}
                {/* <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={[
                    someStyles.h3,
                    {color: '#AEB5BC', fontSize: 20, alignSelf: 'center'},
                  ]}>
                  Irrigação Automática
                </Text>
                <Switch
                  style={{margin: 12}}
                  trackColor={{
                    true: '#3cbc40',
                    false: '#d3d3d3',
                  }}
                  thumbColor={'#fff'}
                  ios_backgroundColor="#d3d3d3"
                  onValueChange={toggleAWSwitch}
                  value={automaticWatering}
                />
              </View> */}

                {/* TODO: Finish actions for manual watering */}
                {/* <Text
                style={[
                  someStyles.h3,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                  {
                    color: '#AEB5BC',
                    fontSize: 20,
                    alignSelf: 'flex-start',
                    marginTop: 14,
                  },
                ]}>
                Intervalo
              </Text>
              <Slider
                disabled={automaticWatering}
                minimumValue={60}
                maximumValue={720}
                step={30}
                thumbTintColor={automaticWatering ? '#767577' : '#3ea341'}
                value={sliderValue}
                onValueChange={(value) => setSliderValue(value)}
              />

              {automaticWatering ? (
                <></>
              ) : (
                <Text
                  style={[
                    someStyles.h3,
                    {
                      color: '#AEB5BC',
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      right: '5%',
                    },
                  ]}>
                  {sliderValue / 60}
                  {sliderValue == 60 ? ' Hora' : ' Horas'}
                </Text>
              )} */}
              </View>
            </View>
            {/* <Divider style={{marginVertical: 16}} /> */}
            {/*MORE...*/}
            {/* {moreContainer} */}
            {/*<Divider style={someStyles.divider} />*/}
          </ScrollView>

          {/* TODO: deviceDispatch context state to handle waterPump post and wait for response... 5s activation trigger. setloadingWaterPump */}
          <TouchableHighlight
            underlayColor="#3ea341"
            activeOpacity={1}
            style={someStyles.button}
            disabled={loadingWaterPump}
            onPress={toggleWaterPump}>
            {loadingWaterPump ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text style={[someStyles.textButton]}>Ativar Bomba de Água</Text>
            )}
          </TouchableHighlight>

          <TouchableOpacity
            disabled={loadingWaterPump}
            onPress={() => {
              Alert.alert(
                'Deseja mesmo desvincular o seu dispositivo?',
                `Ao remover seu dispositivo ${device.deviceId}, seus dados e suas informações referentes a conectividade serão apagadas.`,
                [
                  {
                    text: 'Cancelar',
                    onPress: () => {
                      // ...
                    },
                  },
                  {
                    text: 'Sim',
                    onPress: () => {
                      setLoading(true);
                      //TODO: Handle errors
                      deleteDevice(deviceDispatch, device.deviceId);
                      clearUserDevice(userDispatch);
                      setLoading(false);
                    },
                  },
                ],
                {cancelable: false},
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  someStyles.h3,
                  {
                    marginHorizontal: 12,
                    marginTop: 8,
                    marginBottom: 2,
                    color: '#AEB5BC',
                    fontSize: 14,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                Remover dispositivo {device.deviceId}?
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
};

export default Settings;
