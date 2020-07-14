import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {Divider, Slider} from 'react-native-elements';

// Hooks
import {
  useDeviceDispatch,
  useDeviceState,
  getDevice,
  getDeviceAction,
  postDeviceAction,
  deleteDevice,
} from '../../../context/DeviceContext';
import {useUserDispatch, useUserState} from '../../../context/UserContext';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';

// Assets
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import {someStyles} from '../../../Styles';

// interface IDevice {
//   deviceId: string;
//   geolocation: string;
//   productType: string;
//   firmwareVersion: string;
// }

const Settings: React.FC = () => {
  console.log('-- Settings.tsx');
  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();

  //TODO: Save these states to database, and fetch with useEffect()
  // const [device, setDevice] = useState<Device>({deviceId: 'CULLTIVE-000'});

  //TODO: getDevice from context || getAuthenticatedUser with its devices names...
  // setDevice with the fetched data

  const {device} = useDeviceState();

  console.log('action: ' + JSON.stringify(device.action));
  console.log('deviceId: ' + device.deviceId);

  // const {userData} = useUserState();
  // console.log('userData: ' + JSON.stringify(userData));

  const [isLEDEnabled, setIsLEDEnabled] = useState(true);
  const toggleLEDSwitch = (value) => {
    console.log('toggleLEDSwitch: value: ' + value);
    console.log('toggleLEDSwitch: device: ' + JSON.stringify(device));

    // const ledState;

    //TODO: Validation
    const action = {
      ledTape: true,
      waterPump: device.action.waterPump,
    };
    postDeviceAction(deviceDispatch, device.deviceId, action);

    setIsLEDEnabled((previousState) => !previousState);
  };

  const [automaticWatering, setAutomaticWatering] = useState(true);
  const toggleAWSwitch = () =>
    setAutomaticWatering((previousState) => !previousState);

  const [sliderValue, setSliderValue] = useState(360);

  // Refers to waterPump button activity indicator
  const [loading, setLoading] = useState(false);
  const [loadingWaterPump, setLoadingWaterPump] = useState(false);

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

  // Set settings from device
  useEffect(() => {
    console.log('useEffect(): device: ' + JSON.stringify(device));

    if (device !== {}) {
      setIsLEDEnabled(device.action.ledTape);
    } else {
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
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
            const action = {
              ledTape: false,
              waterPump: true,
            };
            postDeviceAction(deviceDispatch, device.deviceId, action);

            setLoadingWaterPump(true);
            setTimeout(() => {
              setLoadingWaterPump(false);
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
