import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import DataAgreementsUndraw from '../../assets/undraw/dataAgreements.svg';

const DataAgreements: React.FC = () => {
  console.log('-- DataAgreements.tsx');

  const navigation = useNavigation();

  useEffect(() => {
    // TODO: some service that looks for devices ssid:(culltiveXXX)
    // save all these found devices in app context?..
    // if none are find go to DeviceNotFound.tsx
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Text style={someStyles.h1}>Ajude a melhorar a culltive</Text>
      <Text style={someStyles.h3}>
        Deseja cultivar uma melhor experiência compartilhando estatísticas do
        dispositivo e relatórios de falhas com a culltive?{' '}
        <Text
          onPress={() => console.log('TODO: open deviceAgreements URL')}
          style={[
            someStyles.h3,
            {color: '#3cbc40', textDecorationLine: 'underline'},
          ]}>
          Saber mais
        </Text>
      </Text>
      <DataAgreementsUndraw
        width={320}
        height={320}
        style={{alignSelf: 'center'}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            // set app context "DataAgreements DENIED"
            navigation.navigate('PlantProfile');
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
        <TouchableOpacity
          onPress={() => {
            // set app context "DataAgreements approval"
            // set this for userInfo?
            // set this for the app?
            // TODO: create a service that uploads statistics of app usage, user usage etc...
            navigation.navigate('PlantProfile');
          }}
          style={someStyles.button}>
          <Text style={[someStyles.textButton, {paddingHorizontal: 16}]}>
            Claro!
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DataAgreements;
