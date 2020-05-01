import React from 'react';
import {Text, View, Switch, TouchableOpacity, StyleSheet} from 'react-native';

import {Slider} from 'react-native-elements';
// import {Divider} from 'react-native-paper';

import {globalStyles} from '../Styles';

import {useNavigation} from '@react-navigation/native';

import {Ionicons} from 'react-native-vector-icons';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [isLEDEnabled, setIsLEDEnabled] = React.useState(true);
  const toggleLEDSwitch = () =>
    setIsLEDEnabled((previousState) => !previousState);

  const [isAWEnabled, setIsAWEnabled] = React.useState(true);
  const toggleAWSwitch = () =>
    setIsAWEnabled((previousState) => !previousState);

  const [sliderValue, setSliderValue] = React.useState(5);

  React.useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerTitle: () => (
        <View style={globalStyles.headerView}>
          <Text
            style={
              (globalStyles.headerTitle,
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
  }, [navigation]);

  return (
    <View style={[styles.container, {padding: 6}]}>
      {/*ACCOUNT*/}
      <View style={styles.accountContainer}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="ios-contact"
            size={40}
            color="#353535"
            style={{marginRight: 12, alignSelf: 'center'}}
          />
          <Text
            style={
              (styles.text,
              {fontWeight: '200', fontSize: 32, alignSelf: 'center'})
            }>
            Account
          </Text>
        </View>
        <View style={{flexDirection: 'column', marginHorizontal: 12}}>
          <Text
            style={
              (styles.text, {color: '#AEB5BC', fontSize: 20, marginVertical: 8})
            }>
            Username:
          </Text>
          <Text
            style={
              (styles.text, {color: '#AEB5BC', fontSize: 20, marginVertical: 8})
            }>
            Change Password:
          </Text>
          <Text
            style={
              (styles.text, {color: '#AEB5BC', fontSize: 20, marginVertical: 8})
            }>
            Facebook:
          </Text>
        </View>
      </View>
      {/*<Divider style={globalStyles.divider} />*/}
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
            style={
              (styles.text,
              {fontWeight: '200', fontSize: 32, alignSelf: 'center'})
            }>
            Device
          </Text>
        </View>

        <View style={{flexDirection: 'column', marginHorizontal: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={
                (styles.text,
                {color: '#AEB5BC', fontSize: 20, alignSelf: 'center'})
              }>
              LED State
            </Text>
            <Switch
              style={{margin: 12}}
              trackColor={{false: '#767577', true: '#3ea341'}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLEDSwitch}
              value={isLEDEnabled}
            />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={
                (styles.text,
                {color: '#AEB5BC', fontSize: 20, alignSelf: 'center'})
              }>
              Automatic Watering
            </Text>
            <Switch
              style={{margin: 12}}
              trackColor={{false: '#767577', true: '#3ea341'}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAWSwitch}
              value={isAWEnabled}
            />
          </View>

          <Text
            style={
              (styles.text,
              {
                color: '#AEB5BC',
                fontSize: 20,
                alignSelf: 'flex-start',
                marginTop: 14,
              })
            }>
            Water Interval
          </Text>
          <Slider
            style={{marginHorizontal: 8}}
            disabled={isAWEnabled}
            minimumValue={1}
            maximumValue={5}
            step={1}
            thumbTintColor={isAWEnabled ? '#767577' : '#3ea341'}
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
          />

          <Text
            style={
              (styles.text,
              {
                color: '#AEB5BC',
                fontSize: 16,
                alignSelf: 'flex-end',
                right: '5%',
              })
            }>
            {sliderValue}
            {sliderValue == 1 ? ' Hour' : ' Hours'}
          </Text>
        </View>
      </View>
      {/*<Divider style={globalStyles.divider} />*/}

      {/*ACCOUNT*/}
      <View style={styles.accountContainer}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="ios-apps"
            size={40}
            color="#353535"
            style={{marginRight: 12, alignSelf: 'center'}}
          />
          <Text
            style={
              (styles.text,
              {fontWeight: '200', fontSize: 32, alignSelf: 'center'})
            }>
            More
          </Text>
        </View>
        <View style={{flexDirection: 'column', marginHorizontal: 12}}>
          <Text
            style={
              (styles.text, {color: '#AEB5BC', fontSize: 20, marginVertical: 8})
            }>
            Language:
          </Text>
        </View>
      </View>
      {/*<Divider style={globalStyles.divider} />*/}

      {/*WATER PUMP BUTTON*/}
      <TouchableOpacity
        style={[globalStyles.touchableOpacityButton2]}
        onPress={() => alert('PUMPING WATTA')}
        // TODO: Develop a endpoint for waterPump
      >
        <Text style={[globalStyles.headerTitle]}>Water Pump</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  accountContainer: {
    alignItems: 'stretch',
    margin: 16,
  },
  deviceContainer: {
    alignItems: 'stretch',
    margin: 16,
  },
});
