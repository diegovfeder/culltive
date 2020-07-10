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
  deleteDevice,
  waterPump,
} from '../../../context/DeviceContext';
import {useUserDispatch, useUserState} from '../../../context/UserContext';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';

// Assets
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import {someStyles} from '../../../Styles';

interface Device {
  deviceId: string;
  geolocation: string;
  productType: string;
  firmwareVersion: string;
  wifiPassword: string;
  wifiSSID: string;
  wifiStatus: string;
}

const Settings: React.FC = () => {
  console.log('-- Settings.tsx');
  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();

  //TODO: Save these states to database, and fetch with useEffect()
  // const [device, setDevice] = useState<Device>({deviceId: 'CULLTIVE-000'});

  //TODO: getDevice from context || getAuthenticatedUser with its devices names...
  // setDevice with the fetched data
  //FIXME: Change name to device.deviceId
  const {device} = useDeviceState();
  const {name} = useDeviceState();
  console.log('device name: ' + name);

  // const {userData} = useUserState();
  // console.log('userData: ' + JSON.stringify(userData));

  const [isLEDEnabled, setIsLEDEnabled] = useState(true);
  const toggleLEDSwitch = () =>
    setIsLEDEnabled((previousState) => !previousState);

  const [automaticWatering, setAutomaticWatering] = useState(true);
  const toggleAWSwitch = () =>
    setAutomaticWatering((previousState) => !previousState);

  const [sliderValue, setSliderValue] = useState(360);

  // Button Action Waiting
  const [loading, setLoading] = useState(false);

  // const waterPumpButton = (
  //   <TouchableOpacity
  //     style={[someStyles.touchableOpacityButton2]}
  //     onPress={() => alert('PUMPING WATTA')}
  //     // TODO: Develop a endpoint for waterPump
  //   >
  //     <Text style={[someStyles.headerTitle]}>Water Pump</Text>
  //   </TouchableOpacity>
  // );

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
                  onValueChange={toggleLEDSwitch}
                  value={isLEDEnabled}
                />
              </View>

              <View
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
              </View>

              <Text
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
              )}
            </View>
          </View>
          {/* <Divider style={{marginVertical: 16}} /> */}
          {/*MORE...*/}
          {/* {moreContainer} */}
          {/*<Divider style={someStyles.divider} />*/}
        </ScrollView>

        {/* TODO: deviceDispatch context state to handle waterPump post and wait for response... 5s activation trigger. setLoading */}
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          style={someStyles.button}
          onPress={() => {
            console.log('TODO: Water Pump Action');
            // TODO: FINISH THIS !!!
            // waterPump(deviceDispatch, setLoading);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 5000);
          }}>
          {loading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={[someStyles.textButton]}>Ativar Bomba de Água</Text>
          )}
        </TouchableHighlight>

        {/* TODO: Get DEVICE-ID and set its name dynamically */}
        {/* TODO: Feature: textInput for deviceId verification -> make the user type deviceId to delete device */}
        <TouchableOpacity
          onPress={() => {
            console.log(
              'TODO: handleDeleteDevice(deviceDispatch, ...) -> should remove from db and go back to HomeScreen making SettingsScreen inaccessible again',
            );
            Alert.alert(
              'Deseja mesmo desvincular o seu dispositivo?',
              `Ao remover seu dispositivo ${name}, seus dados e suas informações referentes a conectividade serão apagadas.`,
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
                    //TODO: Handle Error (404) ===  Device not found
                    // deleteDevice(deviceDispatch, device.deviceId);
                    deleteDevice(deviceDispatch, name);
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
              Remover dispositivo {name}?
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

// FIXME:
// trackColor={{false: '#767577', true: '#3ea341'}}
//   trackColor={{ true: '#7ab8e1', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
// thumbColor={[Platform.OS=='ios'?'#FFFFFF':(item.status ?'#7ab8e1':'#ffffff')]}
// ios_backgroundColor="#fbfbfb"
