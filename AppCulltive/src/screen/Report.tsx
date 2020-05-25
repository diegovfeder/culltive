import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import axios from 'axios';

// Components
import MyCarousel from '../component/MyCarousel';
// import {Calendar} from 'react-native-calendars';

// Styles
import {someStyles} from '../Styles';
const {height, width} = Dimensions.get('window');

const Report: React.FC = () => {
  const navigation = useNavigation();

  const [loadingWeather, setLoadingWeather] = useState(true);
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');

  // TODO: feat (Calendar picker -> retrieve data from firestore for selected date)
  // const [calendarView, setCalendarView] = useState(false);

  const today = new Date();
  const date =
    today.getDate() +
    '/' +
    parseInt(today.getMonth() + 1) +
    '/' +
    today.getFullYear();
  const hours = today.getHours() + ':' + today.getMinutes();

  useEffect(() => {
    // TODO: getData from firestore // get data from weatherAPI
    // getDeviceStatus(dataDispatch);
    // getReadings(dataDispatch);
    // console.log(devices.data);
    // console.log(readings.data);
    navigation.setOptions({
      title: 'Report',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Relatório:</Text>
          <Text style={someStyles.headerSubtitle}>{date.toString()}</Text>
        </View>
      ),
    });

    // TODO: Make this get request better...
    // `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather?id=3464975&appid=e23da0e080203453b203b91febafb4dd&units=metric',
      )
      .then((res) => {
        setLoadingWeather(false);
        setCity(res.data.name);
        setTemperature(res.data.main.temp.toFixed());
        setWeather(res.data.weather[0].main);
        console.log(res.data);
      })
      .catch((err) => {
        console.log('OpenWeather: ERROR: ' + err);
      });
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

  const weatherContainer = (
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
      {loadingWeather ? (
        <ActivityIndicator color={'#3cbc40'} />
      ) : (
        <View>
          <Text style={someStyles.h3}>
            {city} - {hours}
          </Text>
          <Text style={someStyles.h2}>{temperature} ˚C</Text>
          <Text style={someStyles.h3}>{weather}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        marginVertical: 16,
      }}>
      <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Clima</Text>

      {weatherContainer}

      <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Sensores</Text>
      <MyCarousel data={sensorData} />
    </View>
  );
};
export default Report;

// FIXME:
// {calendarView && (
//   <View vis style={{flex: 2, marginVertical: 16}}>
//     <Calendar
//       current={'2012-03-01'}
//       minDate={'2012-05-10'}
//       maxDate={'2012-05-30'}
//       onDayPress={(day) => {
//         console.log('selected day', day);
//       }}
//       onDayLongPress={(day) => {
//         console.log('selected day', day);
//       }}
//       monthFormat={'yyyy MM'}
//       onMonthChange={(month) => {
//         console.log('month changed', month);
//       }}
//       hideArrows={true}
//       renderArrow={(direction) => <Arrow />}
//       hideExtraDays={true}
//       disableMonthChange={true}
//       firstDay={1}
//       hideDayNames={true}
//       showWeekNumbers={true}
//       onPressArrowLeft={(substractMonth) => substractMonth()}
//       onPressArrowRight={(addMonth) => addMonth()}
//       disableArrowLeft={true}
//       disableArrowRight={true}
//     />
//   </View>
// )}
