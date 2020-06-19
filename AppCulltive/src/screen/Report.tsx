import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import api from 'axios';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
// import tz from 'moment-timezone';

// Components
import MyCarousel from '../component/MyCarousel';
// import {Calendar} from 'react-native-calendars';

// Styles
import {someStyles} from '../Styles';
import AppNavigator from 'src/navigation/AppNavigator';
const {height, width} = Dimensions.get('window');

const Report: React.FC = () => {
  moment.locale('pt-BR');
  const timezone = 'America/Sao_Paulo';
  const format = 'MMMM Do YYYY, h:mm:ss a';
  // console.log(tz('America/Los_Angeles').format('ha z'));
  // const dateMoment = moment.tz(date, format, timezone);

  const navigation = useNavigation();
  const route = useRoute();

  const [loadingWeather, setLoadingWeather] = useState(true);
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [fetchingError, setFetchingError] = useState(false);

  // TODO: feat (Calendar picker -> retrieve data from firestore for selected date)
  // const [calendarView, setCalendarView] = useState(false);

  // const fetchLastReading = (key, device = 0) =>
  //   fetch('/api/readings?device=' + device);

  // const info = useQuery('todos', fetchLastReading);
  // const {status, data, error} = useQuery('todos', fetchLastReading);

  // if (status === 'loading') {
  //   return <span>Loading...</span>;
  // }

  // if (status === 'error') {
  //   return <span>Error: {error.message}</span>;
  // }

  const today = new Date();
  const date =
    today.getDate() +
    '/' +
    parseInt(today.getMonth() + 1) +
    '/' +
    today.getFullYear();
  const hours = today.getHours() + ':' + today.getMinutes();

  //TODO: Weather Icons
  // https://github.com/erikflowers/weather-icons
  // https://gist.github.com/tbranyen/62d974681dea8ee0caa1

  useEffect(() => {
    console.log(today.getHours() + ' : ' + today.getMinutes());
    console.log(moment().format('LLL'));

    // TODO: getData from firestore // get data from weatherAPI
    // getDeviceStatus(dataDispatch);
    // getReadings(dataDispatch);
    // console.log(devices.data);
    // console.log(readings.data);

    navigation.setOptions({gestureEnabled: false});
    navigation.setOptions({swipeEnabled: false});
    // route.state.index > 0 ? props.navigation.setOptions({ gestureEnabled: false }) : props.navigation.setOptions({ gestureEnabled: true })

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
        console.log('openWeather data: ' + JSON.stringify(res.data));
      })
      .catch((err) => {
        setLoadingWeather(false);
        setFetchingError(true);
        //TODO: Set another state to try to load data again // handle Error routine...
        console.log('OpenWeather: ERROR: ' + err);
      });

    //TODO: Fetch data from culltive/firestore
    // api.get(`device/$[deviceId]`)
  }, []);

  // TODO: Get data from Firestore
  const sensorData = [
    {
      title: 'Humidade do ar',
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

  // style={{justifyContent: 'center', alignSelf: 'center'}}
  const weatherContainer = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
        marginHorizontal: 16,
        padding: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: 5,
        shadowOpacity: 10,
        shadowRadius: 20,
        borderRadius: 16,
        elevation: 5,
      }}>
      {loadingWeather ? (
        <View
        // style={{margin: 48,}}
        >
          <ActivityIndicator
            color={'#3ea341'}
            style={{justifyContent: 'center'}}
          />
        </View>
      ) : fetchingError ? (
        <View
          style={{padding: 2, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[someStyles.h3, {fontSize: 20, textAlign: 'center'}]}>
            Falha ao carregar informações
          </Text>
          <Text
            style={[
              someStyles.h3,
              {marginVertical: 8, fontSize: 12, textAlign: 'center'},
            ]}>
            Verifique sua conexão com a internet.
          </Text>
        </View>
      ) : (
        <View>
          <Text style={[someStyles.h3, {paddingVertical: 2, fontSize: 18}]}>
            {city}
          </Text>
          <Text
            style={[
              someStyles.h3,
              {fontSize: 14, paddingVertical: 4, textAlign: 'center'},
            ]}>
            {moment().format('LLL')}
          </Text>
          <Text style={[someStyles.h1, {fontSize: 32}]}>{temperature} ˚C</Text>
          {/* TODO: WeatherIcons */}
          {/* <Text style={[someStyles.h2, {alignSelf: 'center'}]}>{weather}</Text> */}
        </View>
      )}
    </View>
  );

  return (
    <View
      style={[
        someStyles.container,
        {
          flex: 1,
          justifyContent: 'flex-start',
        },
      ]}>
      <Text style={[someStyles.h1, {alignSelf: 'flex-start', marginBottom: 2}]}>
        Clima
      </Text>

      {weatherContainer}

      <Text style={[someStyles.h1, {alignSelf: 'flex-start', marginBottom: 2}]}>
        Sensores
      </Text>
      <MyCarousel
        onPress={() => {
          console.log('MyCarousel onPress: ' + sensorData);
        }}
        data={sensorData}
      />
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
