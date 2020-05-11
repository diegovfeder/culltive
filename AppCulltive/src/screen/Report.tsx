import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

// Components
import Carousel from 'react-native-snap-carousel';
import MyCarousel from '../component/MyCarousel';
import {Calendar} from 'react-native-calendars';

// Styles
import {someStyles} from '../Styles';
const {height, width} = Dimensions.get('window');

const Report: React.FC = () => {
  const navigation = useNavigation();
  // TODO: feat (Calendar picker -> retrieve data from firestore for selected date)
  const [calendarView, setCalendarView] = useState(false);

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
      {calendarView && (
        <View vis style={{flex: 2, marginVertical: 16}}>
          <Calendar
            current={'2012-03-01'}
            minDate={'2012-05-10'}
            maxDate={'2012-05-30'}
            onDayPress={(day) => {
              console.log('selected day', day);
            }}
            onDayLongPress={(day) => {
              console.log('selected day', day);
            }}
            monthFormat={'yyyy MM'}
            onMonthChange={(month) => {
              console.log('month changed', month);
            }}
            hideArrows={true}
            renderArrow={(direction) => <Arrow />}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1}
            hideDayNames={true}
            showWeekNumbers={true}
            onPressArrowLeft={(substractMonth) => substractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableArrowLeft={true}
            disableArrowRight={true}
          />
        </View>
      )}
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
