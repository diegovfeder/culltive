import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// Hooks
import {useNavigation} from '@react-navigation/native';

// Context
import {useDeviceDispatch, setDeviceToken} from '../../context/DeviceContext';
import {useDeviceState} from '../../context/DeviceContext';

// Styles
import {someStyles} from '../../Styles';

// Assets
import * as Svg from 'react-native-svg';
import DataAgreementsUndraw from '../../../assets/undraw/dataAgreements.svg';

const DataAgreements: React.FC = () => {
  console.log('-- DataAgreements.tsx');

  const navigation = useNavigation();
  const deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();

  console.log('Paired: ' + paired);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={[someStyles.h1, {textAlign: 'center'}]}>
        Ajude-nos a melhorar
      </Text>
      <Text style={someStyles.h3}>
        Deseja cultivar uma melhor experiência compartilhando estatísticas do
        dispositivo e relatórios de falhas com a culltive?{' '}
      </Text>
      <TouchableOpacity
        onPress={() => console.log('TODO: open deviceAgreements URL')}>
        <Text
          style={[
            someStyles.h3,
            {color: '#3cbc40', textDecorationLine: 'underline'},
          ]}>
          Saber mais
        </Text>
      </TouchableOpacity>
      <DataAgreementsUndraw
        width={300}
        height={300}
        style={{alignSelf: 'center'}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            //TODO: set dataAgreements to FALSE in user database?
            navigation.navigate('Home');
            // navigation.navigate('PlantProfile');
          }}
          style={{alignSelf: 'center'}}>
          <Text
            style={[
              someStyles.textButton,
              {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
            ]}>
            Não, obrigado
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={0.8}
          onPress={() => {
            //TODO: set dataAgreements to TRUE in user database?
            navigation.navigate('Home');
            // navigation.navigate('PlantProfile');
          }}
          style={someStyles.button}>
          <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
            Claro!
          </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export default DataAgreements;

// set app context "DataAgreements DENIED"

// set app context "DataAgreements approval"
// set this for userInfo?
// set this for the app?
// TODO: create a service that uploads statistics of app usage, user usage etc...
// navigation.navigate('PlantProfile');

// useEffect(() => {
//   // TODO: some service that looks for devices ssid:(culltiveXXX)
//   // save all these found devices in app context?..
//   // if none are find go to DeviceNotFound.tsx
// }, []);
