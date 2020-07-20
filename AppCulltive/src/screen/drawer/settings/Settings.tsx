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

// import {Divider, Slider} from 'react-native-elements';

// Hooks
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

import {
  useUserDispatch,
  useUserState,
  clearUserDevice,
} from '../../../context/UserContext';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';

// Assets
import {someStyles} from '../../../Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

// interface IDevice {
//   deviceId: string;
//   geolocation: string;
//   productType: string;
//   firmwareVersion: string;
// }
//TODO: Save these states to database, and fetch with useEffect()
// const [device, setDevice] = useState<IDevice>({deviceId: 'CULLTIVE-000'});

const Settings: React.FC = () => {
  console.log('-- Settings.tsx');
  const navigation = useNavigation();

  const userDispatch = useUserDispatch();
  const {user} = useUserState();

  const deviceDispatch = useDeviceDispatch();
  const {device, error, loading: loadingDevice} = useDeviceState();

  const [isLEDEnabled, setIsLEDEnabled] = useState(true);
  const [isLEDSwitchDisable, setLEDSwitchDisable] = useState(false);

  const [loading, setLoading] = useState(true);
  // Refers to waterPump button activity indicator
  const [loadingWaterPump, setLoadingWaterPump] = useState(false);

  // const [automaticWatering, setAutomaticWatering] = useState(true);
  // const [sliderValue, setSliderValue] = useState(360);

  //TODO: getDevice from context || getAuthenticatedUser with its devices names...
  // setDevice with the fetched data

  // const {userData} = useUserState();
  // console.log('userData: ' + JSON.stringify(userData));

  useEffect(() => {
    console.log('Settings-> error: ' + JSON.stringify(error));

    //Error is coming from?
    if (error !== null) {
      if (typeof error.from !== 'undefined' || typeof error.from !== 'null') {
        console.log('is not undefined or null');
        if (error.from === 'postDeviceAction') {
          console.log('error from postDevice');
          //TODO: get response?

          // means action did not come from waterPump Button
          if (!loadingWaterPump) setIsLEDEnabled(!isLEDEnabled);

          setLoadingWaterPump(false);
          // toggleLEDSwitch(device.action.ledTape);
        }
      }
    }

    if (error !== null) {
      if (error.code === 500) {
        console.log('500 Network Error: ' + JSON.stringify(error));
        Alert.alert(
          'Ops...',
          'Erro de conexão, tente novamente.' + '\n\n' + error.err.message,
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
        console.log('Error.code == 500: ' + JSON.stringify(error));
        Alert.alert(
          'Ops...',
          'Erro de conexão, tente novamente.' +
            '\n\n' +
            error.err.message +
            ' from ' +
            error.from,
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
      console.log('error === null');
    }
  }, [error]);

  // loadingDevice

  useEffect(() => {
    console.log('Settings-> device: ' + JSON.stringify(device));

    if (device.deviceId !== null || device.deviceId !== undefined) {
      setLoading(false);
    } else {
      // getDevice();
      //...
    }
  }, [device]);
  useEffect(() => {
    console.log('Settings-> device: ' + JSON.stringify(device));

    if (device.deviceId !== null || device.deviceId !== undefined) {
      setLoading(false);
    } else {
      // getDevice();
      //...
    }
  }, [device]);

  //printDevice
  useEffect(() => {
    // console.log('action: ' + JSON.stringify(device.action));
    console.log('deviceId: ' + device.deviceId);

    if (typeof device.deviceId === 'undefined') {
      console.log('haha');
    } else {
      console.log('hehe');
    }
  }, [device]);

  //FIXME:
  // Set settings from device
  useEffect(() => {
    console.log('useEffect(): device: ' + JSON.stringify(device));

    if (device !== {} && typeof device.action.ledTape !== 'undefined') {
      console.log('device.action.ledTape !== undefined');
      setIsLEDEnabled(device.action.ledTape);
    } else {
      console.log('device.action.ledTape == undefined');
    }
  }, [device]);

  //TODO: GET DEVICE, STAY IN THE loadingWaterPump,
  //WHEN LOADED UPDATE VALUES
  // useEffect(() => {
  //   getDeviceAction(deviceDispatch, device.deviceId);

  //   setIsLEDEnabled(device.action.ledTape);
  // }, [device]);

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

    //TODO: get Errors from response, show notifications for network error (alert message at first)
    //      and re-toggle ledSwitch with setTimeout(200), updating value for the user

    // if (!error) {
    const action = {
      ledTape: currentState,
      waterPump: device.action.waterPump,
    };

    if (device.deviceId.includes('CULLTIVE')) {
      console.log('toggleLEDSwitch: ' + JSON.stringify(device));
      postDeviceAction(deviceDispatch, device.deviceId, action);
    } else {
      console.log('toggleLEDSwitch: (no device Id) ');
    }

    setIsLEDEnabled((previousState) => !previousState);
    // } else {
    //   console.log(JSON.stringify(error))
    //   setIsLEDEnabled(oldState)
    // }
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

  const accountContainer = (
    <View style={styles.accountContainer}>
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
    <View style={styles.accountContainer}>
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
      ) : (
        <SafeAreaView style={someStyles.container}>
          <ScrollView>
            {/*ACCOUNT*/}
            {/* {accountContainer} */}
            {/* <Divider style={{margin: 8}} /> */}

            {/*DEVICE*/}
            <View style={styles.deviceContainer}>
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
                    disabled={isLEDSwitchDisable}
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
            onPress={() => {
              setLEDSwitchDisable(true);

              const action = {
                ledTape: isLEDEnabled,
                waterPump: true,
              };
              postDeviceAction(deviceDispatch, device.deviceId, action);

              setLoadingWaterPump(true);
              setTimeout(() => {
                setLEDSwitchDisable(false);
                setLoadingWaterPump(false);
                setDeviceAction(deviceDispatch, {
                  ledTape: device.action.ledTape,
                  waterPump: false,
                });
              }, 5000);
            }}>
            {loadingWaterPump ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text style={[someStyles.textButton]}>Ativar Bomba de Água</Text>
            )}
          </TouchableHighlight>

          {/* TODO: Feature: textInput for deviceId verification -> make the user type deviceId to delete device */}
          <TouchableOpacity
            onPress={() => {
              console.log(
                'TODO: handleDeleteDevice(deviceDispatch, ...) -> should remove from db and go back to HomeScreen making SettingsScreen inaccessible again',
              );
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
                      //TODO: Handle errors
                      deleteDevice(deviceDispatch, device.deviceId);
                      //TODO: If deleteDevice returned OK / true / 200
                      clearUserDevice(userDispatch, device.deviceId);
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

const styles = StyleSheet.create({
  accountContainer: {
    alignItems: 'stretch',
    margin: 16,
  },
  deviceContainer: {
    alignItems: 'stretch',
    marginVertical: 12,
    marginHorizontal: 4,
  },
});
