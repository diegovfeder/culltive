import React, {useEffect, useRef, useState, useContext} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';

// Navigation
import {useNavigation, useRoute} from '@react-navigation/native';

// API
import axios from 'axios';
import api from '../../util/api';
import {useQuery} from 'react-query';

// Context
import {
  useDeviceDispatch,
  useDeviceState,
  getDevice,
} from '../../context/DeviceContext';

// Components
import MyCarousel from '../../component/MyCarousel';
// import {Calendar} from 'react-native-calendars';

// Moment
import moment from 'moment';
import 'moment/locale/pt-br';
// import tz from 'moment-timezone';

// Assets
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {someStyles} from '../../Styles';
import {someColors} from '../../Colors';

interface IReading {
  air: number;
  createdAt: string;
  deviceId: string;
  ledTape: boolean;
  lumi1: number;
  lumi2: number;
  soil1: number;
  soil2: number;
  temp: number;
  waterLevel: string;
  waterPump: boolean;
}

const Report: React.FC = () => {
  console.log('-- Report.tsx');

  const navigation = useNavigation();

  const {device} = useDeviceState();

  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');

  const [weather, setWeather] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [fetchWeatherError, setFetchWeatherError] = useState(false);
  // const openWeatherAPIKey = 'e23da0e080203453b203b91febafb4dd';

  //TODO: Get location from device context...
  // const [latitude, setLatitude] = useState('-25.43');
  // const [longitude, setLongitude] = useState('-49.27');

  const [reading, setReading] = useState<IReading>({
    air: 0,
    createdAt: '',
    deviceId: '',
    ledTape: false,
    lumi1: 0,
    lumi2: 0,
    soil1: 0,
    soil2: 0,
    temp: 0,
    waterLevel: '',
    waterPump: false,
  });
  const [loadingReading, setLoadingReading] = useState(true);
  const [fetchReadingError, setFetchReadingError] = useState(false);

  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);

  // const {height, width} = Dimensions.get('window');

  useEffect(() => {
    setLoading(loadingWeather || loadingReading);
    setError(fetchWeatherError || fetchReadingError);
  }, [loadingWeather, loadingReading, fetchWeatherError, fetchReadingError]);

  //TODO: Set timezone for user locale -> getDeviceLocation
  moment.locale('pt-BR');

  const today = new Date();
  const date =
    today.getDate() +
    '/' +
    parseInt(today.getMonth() + 1) +
    '/' +
    today.getFullYear();

  // const timezone = 'America/Sao_Paulo';
  // const format = 'MMMM Do YYYY, h:mm:ss a';

  // console.log(tz('America/Los_Angeles').format('ha z'));
  // const dateMoment = moment.tz(date, format, timezone);

  // TODO: feat (Calendar picker -> retrieve data from firestore for selected date)
  // const [calendarView, setCalendarView] = useState(false);

  //TODO: weatherIcons
  // https://github.com/erikflowers/weather-icons
  // https://gist.github.com/tbranyen/62d974681dea8ee0caa1

  // Standard sensorData values passed as props to MyCarosel.tsx
  let sensorData = [
    {
      id: 'air',
      title: 'Umidade do ar',
      text: 'Fator relevante no processo de evapotranspiração',
      value: '[air]',
      unit: '%',
    },
    {
      id: 'lumi',
      title: 'Taxa de luz',
      text: 'Determinante no crescimento do seu cultivo',
      value: '[lumi1], [lumi2]',
      unit: 'PPFD',
    },
    {
      id: 'soil',
      title: 'Umidade do solo',
      text: 'Define os ciclos de irrigação',
      value: '[soil1], [soil2]',
      unit: '%',
    },
    {
      id: 'temp',
      title: 'Temperatura',
      text: 'Influencia as atividades fisiológicas da planta',
      value: '[temp]',
      unit: '°C',
    },
  ];

  const weatherContainer = (
    <View style={someStyles.weatherContainer}>
      <Text
        style={[
          someStyles.h3,
          someColors.dark_blue,
          {paddingVertical: 2, fontSize: 18},
        ]}>
        {city}
      </Text>
      <Text
        style={[
          someStyles.h3,
          someColors.light_blue,
          {fontSize: 14, paddingVertical: 4, textAlign: 'center'},
        ]}>
        {moment().format('LLL')}
      </Text>
      <Text style={[someStyles.h1, someColors.blue, {fontSize: 32}]}>
        {temperature}˚C
      </Text>
      {/* TODO: WeatherIcons */}
      {/* <Text style={[someStyles.h2, {alignSelf: 'center'}]}>{weather}</Text> */}
    </View>
  );

  const loadingContainer = (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator
        color={'#3ea341'}
        animating={loading}
        size={'large'}
        style={{justifyContent: 'center'}}
      />
    </View>
  );

  const errorContainer = (
    <View style={{padding: 2, alignItems: 'center', justifyContent: 'center'}}>
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
  );

  const sensorDataContainer = (
    <View
      style={{
        padding: 2,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <MyCarousel data={sensorData} />
    </View>
  );

  const _copyReadingToSensorData = () => {
    //TODO: Null verification...
    sensorData[0].value = reading?.air.toString();
    sensorData[1].value = reading?.lumi1.toString();
    sensorData[2].value = reading?.soil1.toString();
    sensorData[3].value = reading?.temp.toString();

    console.log('sensorData: ' + JSON.stringify(sensorData));
  };

  const fixUndefinedData = () => {
    sensorData[0].value = '0';
    sensorData[1].value = '0';
    sensorData[2].value = '0';
    sensorData[3].value = '0';
  };

  const mapSoilHumidityData = () => {
    // Soil Humidity is position 2 of sensorData array
    // TODO: should gather soil1 and soil2 for the calculation
    const MAX_HUMI = 600;
    const MIN_HUMI = 1024;
    sensorData[2].value = Number(
      (MAX_HUMI * sensorData[2].value) / MIN_HUMI,
    ).toString();
  };

  // Navigation Options
  useEffect(() => {
    // Sets navigation gesture and swipe to false so it doesn't block card gestures
    navigation.setOptions({gestureEnabled: false});
    navigation.setOptions({swipeEnabled: false});

    // Set header title and subtitle
    navigation.setOptions({
      title: 'Report',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Relatório:</Text>
          <Text style={someStyles.headerSubtitle}>{date.toString()}</Text>
        </View>
      ),
    });
  }, []);

  // Fetch readings from firestore
  useEffect(() => {
    api
      .get(`/reading/${device.deviceId}`)
      .then((res) => {
        console.log('res.data: ' + JSON.stringify(res.data));
        setReading(res.data[0]);
        setLoadingReading(false);
      })
      .catch((err) => {
        setLoadingReading(false);
        setFetchReadingError(true);
        //TODO: Set another state to try to load data again // handle Error routine...
        console.log('api/reading: ERROR: ' + err);
      });
  }, []);

  // Copy fetched readings to sensorData
  useEffect(() => {
    console.log('Reading: ' + JSON.stringify(reading));
    if (typeof reading !== 'undefined') {
      _copyReadingToSensorData();
    } else {
      console.log('reading is undefined?...');
      // If reading is undefined, change the values for sensorData object ([temp] [air] [lumi], etc) to 0 or blank
      // Or show error message?...
      fixUndefinedData();
    }
  }, [reading, sensorData]);

  return (
    <View style={[someStyles.container_spaced]}>
      {loading ? (
        loadingContainer
      ) : error ? (
        errorContainer
      ) : (
        <View>
          {/* Sensor Report Container*/}
          <View>{sensorDataContainer}</View>
          {/* Weather Report Container*/}
          {/* Removed for the moment, pasted at the bottom of the code or notion. */}
        </View>
      )}
    </View>
  );
};
export default Report;

// weather CONTAINER STUFF...
/* <View>
<View
  style={{
    flexDirection: 'row',
  }}>
  <Text
    style={[
      someStyles.h2,
      someColors.tertiary,
      {paddingBottom: 4},
    ]}>
    CLIMA
  </Text>
</View>
{weatherContainer}
</View> */

// Get weather values from openWeather and set data in weatherContainer
// useEffect(() => {
//   axios
//     .get(
//       `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${openWeatherAPIKey}&units=metric`,
//     )
//     .then((res) => {
//       console.log('openWeather data: ' + JSON.stringify(res.data));

//       setLoadingWeather(false);
//       setCity(res.data.name);
//       setTemperature(res.data.main.temp.toFixed());
//       setWeather(res.data.weather[0].main);
//     })
//     .catch((err) => {
//       console.log('OpenWeather: ERROR: ' + err);

//       setLoadingWeather(false);
//       setFetchWeatherError(true);
//       //TODO: Set another state to try to load data again // handle Error routine...
//     });
// }, []);

//------------------------------------------------------------//
//            TRASHED CODE
//------------------------------------------------------------//

// useQuery fetch data from firestore/readings/{deviceId}
// const fetchLastReading = async (deviceId) => {
//   const response = await fetch(
//     `https://us-central1-culltive.cloudfunctions.net/api/reading/${deviceId}`,
//   );
//   const data = await response.json();
//   return data;
// };

// let {status, data, error} = useQuery([deviceId], fetchLastReading);

// useEffect(() => {
//   // console.log(Object.entries(data));
//   // console.log(JSON.stringify(data));

//   if (typeof data !== 'undefined') {
//     setReading({...data});
//     console.log('READING: ' + JSON.stringify(reading));
//     // console.log(data.keys());
//     // data.map();
//   } else {
//     console.log('ERROR: ' + error);
//   }

//   sensorData.forEach((item) => {
//     // sensorData.set;
//   });
// }, [data]);

// if (status === 'loading') {
//   console.log('loading query...');
// } else {
//   console.log('DATA: ' + JSON.stringify(data));
// }

// if (status === 'error') {
//   console.log('ERROR: ' + error);
// }

// FIXME: FEATURE: Calendar picker select day for the report
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

// const today = new Date();
// const date =
//   today.getDate() +
//   '/' +
//   parseInt(today.getMonth() + 1) +
//   '/' +
//   today.getFullYear();
// const hours = today.getHours() + ':' + today.getMinutes();

// {/* {loadingReading ? (
//   <View style={{}}>
//     <ActivityIndicator
//       color={'#3ea341'}
//       style={{justifyContent: 'center'}}
//     />
//   </View>
// ) : fetchReadingError ? (
//   <View
//     style={{padding: 2, alignItems: 'center', justifyContent: 'center'}}>
//     <Text style={[someStyles.h3, {fontSize: 20, textAlign: 'center'}]}>
//       Falha ao carregar informações
//     </Text>
//     <Text
//       style={[
//         someStyles.h3,
//         {marginVertical: 8, fontSize: 12, textAlign: 'center'},
//       ]}>
//       Verifique sua conexão com a internet.
//     </Text>
//   </View>
// ) : ( */}
// {/* )} */}

// {/* {loadingWeather ? (
//   <View style={{margin: 2}}>
//     <ActivityIndicator
//       color={'#3ea341'}
//       style={{justifyContent: 'center'}}
//     />
//   </View>
// ) : fetchWeatherError ? (
//   <View
//     style={{padding: 2, alignItems: 'center', justifyContent: 'center'}}>
//     <Text style={[someStyles.h3, {fontSize: 20, textAlign: 'center'}]}>
//       Falha ao carregar informações
//     </Text>
//     <Text
//       style={[
//         someStyles.h3,
//         {marginVertical: 8, fontSize: 12, textAlign: 'center'},
//       ]}>
//       Verifique sua conexão com a internet.
//     </Text>
//   </View>
// ) : ( */}
// {/* <View> */}
