import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import MyCarousel from '../component/MyCarousel';

import {useNavigation} from '@react-navigation/native';

import {someStyles} from '../Styles';

const {height, width} = Dimensions.get('window');

const Report: React.FC = () => {
  const navigation = useNavigation();

  const today = new Date();
  const date =
    today.getDate() +
    '/' +
    parseInt(today.getMonth() + 1) +
    '/' +
    today.getFullYear();
  console.log(date);

  useEffect(() => {
    navigation.setOptions({
      title: 'Report',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Report:</Text>
          <Text style={someStyles.headerSubtitle}>{date.toString()}</Text>
        </View>
      ),
    });
    // TODO: getData from firestore // get data from weatherAPI
    // getDeviceStatus(dataDispatch);
    // getReadings(dataDispatch);
    // console.log(devices.data);
    // console.log(readings.data);
  }, []);

  // TODO: Get data from Firestore
  const sensorData = [
    {
      title: 'Humidade atmosférica',
      text: '[moreinfo]',
      value: '[number]',
    },
    {
      title: 'Taxa de luz',
      text: '[moreinfo]',
      value: '[number]',
    },
    {
      title: 'Temperatura',
      text: '[moreinfo]',
      value: '[number]',
    },
    {
      title: 'Humidade do solo',
      text: '[moreinfo]',
      value: '[number]',
    },
    {
      title: 'Nível de água',
      text: '[moreinfo]',
      value: '[number]',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        marginVertical: 16,
      }}>
      <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Clima</Text>
      <View
        style={{
          marginVertical: 8,
          marginHorizontal: 16,
          padding: 16,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: 5,
          shadowOpacity: 10,
          shadowRadius: 20,
          borderRadius: 16,
          elevation: 5,
        }}>
        <Text style={someStyles.h3}>[city] -- [time]</Text>
        <Text style={someStyles.h3}>[weatherTemperature]</Text>
        <Text style={someStyles.h3}>[weatherState]</Text>
      </View>

      <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Sensores</Text>
      <MyCarousel data={sensorData} />
    </View>
  );
};
export default Report;
