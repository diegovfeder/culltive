import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Divider, Slider} from 'react-native-elements';

// Hooks
import {useDeviceDispatch, waterPump} from '../context/DeviceContext';

import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {someStyles} from '../Styles';

const Settings: React.FC = () => {
  const deviceDispatch = useDeviceDispatch();
  const navigation = useNavigation();

  const [isLEDEnabled, setIsLEDEnabled] = useState(true);
  const toggleLEDSwitch = () =>
    setIsLEDEnabled((previousState) => !previousState);

  const [automaticWatering, setAutomaticWatering] = useState(true);
  const toggleAWSwitch = () =>
    setAutomaticWatering((previousState) => !previousState);

  const [sliderValue, setSliderValue] = useState(5);

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

  useEffect(() => {
    navigation.setOptions({
      title: 'Configurações',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text
            style={
              (someStyles.headerTitle,
              {
                color: '#FFF',
                fontWeight: '400',
                fontSize: 22,
              })
            }>
            Settings
          </Text>
        </View>
      ),
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
                {fontWeight: '200', fontSize: 32, alignSelf: 'center'},
              ]}>
              Device
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
                LED State
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
                Automatic Watering
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
              Water Interval
            </Text>
            <Slider
              disabled={automaticWatering}
              minimumValue={60}
              maximumValue={360}
              step={1}
              thumbTintColor={automaticWatering ? '#767577' : '#3ea341'}
              value={sliderValue}
              onValueChange={(value) => setSliderValue(value)}
            />

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
              {sliderValue}
              {sliderValue == 1 ? ' Hour' : ' Hours'}
            </Text>
          </View>
        </View>
        <Divider style={{marginVertical: 16}} />
        {/*MORE...*/}
        {/* {moreContainer} */}
        {/*<Divider style={someStyles.divider} />*/}
      </ScrollView>

      {/* TODO: deviceDispatch context state to handle waterPump post and wait for response... 5s activation trigger. setLoading */}
      <TouchableOpacity
        style={someStyles.button}
        onPress={() => {
          console.log('TODO: Water Pump Action');
          // TODO: FINISH THIS !!!
          // waterPump(deviceDispatch, setLoading);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }}>
        {loading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text style={[someStyles.textButton]}>Ativar Bomba de Água</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
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
