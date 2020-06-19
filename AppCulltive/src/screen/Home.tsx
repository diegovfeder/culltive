import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  check,
  openSettings,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import {Divider} from 'react-native-elements';

// Hooks & Context
import {useNavigation} from '@react-navigation/native';
import {useDeviceDispatch, setDeviceToken} from '../context/DeviceContext';
import {useDeviceState} from '../context/DeviceContext';

// import FirstSigninModal from '../component/FirstSigninModal';

// Styles
import {someStyles} from '../Styles';

// Assets
import * as Svg from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlantHomeUndraw from '../../assets/undraw/plantHome.svg';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

const Home: React.FC = () => {
  console.log('-- Home.tsx');
  const navigation = useNavigation();
  const [modalState, setModalState] = useState(false);

  let deviceDispatch = useDeviceDispatch();
  let {paired} = useDeviceState();
  console.log('Paired: ' + paired);

  // FIXME: Open FirstSigninModal if !paired
  // useEffect(() => {
  //   setTimeout(() => {
  //     setModalState(true);
  //   }, 2000);
  // }, [null]);

  const checkPermissionsOnClick = () => {
    console.log('checkPermissionsOnClick');
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
      }),
    ).then((res: string) => {
      switch (res) {
        case 'unavailable':
          console.log('Unavailable');
          //Then?
          break;
        case 'denied':
          console.log('Denied');
          navigation.navigate('PairNavigator', {screen: 'GrantPermissions'});
          break;
        case 'blocked':
          console.log('Blocked');
          navigation.navigate('PairNavigator', {
            screen: 'GrantPermissions',
          });
          // navigation.navigate('GrantPermissions', res);
          break;
        case 'granted':
          console.log('Granted');
          navigation.navigate('PairNavigator', {screen: 'DeviceCertification'});
          break;
      }
    });
  };

  const handlePairContainerClick = () => {
    console.log('handlePairContainerClick');
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then((res: string) => {
      switch (res) {
        case 'unavailable':
          console.log('Unavailable');
          break;
        case 'denied':
          console.log('Denied');
          break;
        case 'blocked':
          console.log('Blocked');
          // navigation.navigate('GrantPermissions', res);
          break;
        case 'granted':
          console.log('Granted');
          navigation.navigate('PairNavigator', {screen: 'DeviceCertification'});
          break;
      }
    });
  };

  const pairContainer = (
    <TouchableHighlight
      onPress={() => {
        console.log('onPress');
        checkPermissionsOnClick();
        // handlePairContainerClick();
      }}
      underlayColor="#3ea341"
      activeOpacity={0.8}
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 256,
        width: 256,
        height: 256,
        backgroundColor: '#3cbc40',
        shadowRadius: 20,
        shadowOpacity: 10,
        shadowOffset: 20,
        elevation: 20,
      }}>
      <Icon
        name="plus"
        size={200}
        style={{
          alignSelf: 'center',
          marginTop: 12,
          color: '#fff',
        }}
      />
    </TouchableHighlight>
  );

  const loadingContainer = (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 48,
        borderRadius: 128,
        width: 128,
        height: 128,
        backgroundColor: '#DDD',
      }}>
      <ActivityIndicator
        color={'#3cbc40'}
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );

  const plantContainer = (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 16,
        borderRadius: 256,
        width: 256,
        height: 256,
        backgroundColor: '#DDD',
      }}>
      <PlantHomeUndraw width={198} height={256} style={{alignSelf: 'center'}} />
      {/* <PlantHomeUndraw width={200} height={300} style={{alignSelf: 'center'}} /> */}
    </View>
  );

  const activityContainer = (
    <ScrollView style={{height: 96, marginStart: 8}}>
      {/* FIXME: turn into a list */}
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>
        O reservatório de água está ficando vazio
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebeádo luz suficiente
      </Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>
        O reservatório de água está ficando vazio
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebendo luz suficiente
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebendo luz suficiente
      </Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
    </ScrollView>
  );

  return (
    <>
      {!paired ? (
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 12,
            justifyContent: 'center',
          }}>
          <View>
            <Text
              style={[someStyles.h1, {textAlign: 'center', color: '#4d4d5d'}]}>
              Adicionar novo dispositivo
            </Text>
          </View>
          {/*TODO: Ask if user already set up with device pairing*/}
          {/* <FirstSigninModal modalState={modalState} /> */}

          {pairContainer}
        </SafeAreaView>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginHorizontal: 16,
            // marginVertical: 12,
            marginBottom: 12,
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}>
          {/*TODO: Ask if user already set up with device pairing*/}
          {/*<FirstSigninModal modalState={modalState} />*/}

          {/*MAIN CIRCLE / LAZY LOADING*/}
          {/* {loadingContainer} */}

          {plantContainer}

          <Divider style={{marginVertical: 8}} />

          <View style={{}}>
            <Text style={someStyles.h4}>ATIVIDADES RECENTES</Text>
            {activityContainer}
          </View>

          <Divider style={{marginVertical: 8}} />

          <View style={{width: '100%'}}>
            <TouchableHighlight
              underlayColor="#3ea341"
              activeOpacity={1}
              style={someStyles.button}
              onPress={() => navigation.navigate('Report')}>
              <Text style={[someStyles.textButton]}>Relatórios</Text>
            </TouchableHighlight>
          </View>
        </View>
      )}
    </>
  );
};
export default Home;
