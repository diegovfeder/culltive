import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {check, PERMISSIONS} from 'react-native-permissions';

import {Divider} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
// import {ListItem} from 'react-native-elements';

// Hooks & Context
import {useNavigation} from '@react-navigation/native';

import {
  useUserDispatch,
  useUserState,
  getAuthenticatedUser,
} from '../../context/UserContext';
import {
  useDeviceDispatch,
  useDeviceState,
  getDevice,
} from '../../context/DeviceContext';

// import FirstSigninModal from '../component/FirstSigninModal';

// Assets
import {someStyles} from '../../Styles';
import {someColors} from '../../Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlantHomeUndraw from '../../../assets/undraw/plantHome.svg';
import * as Svg from 'react-native-svg';
import Logo from '../../component/Logo';

const Home: React.FC = () => {
  console.log('-- Home.tsx');
  const navigation = useNavigation();

  const [loading, isLoading] = useState(true);

  let userDispatch = useUserDispatch();
  let {loading: loadingUser, user} = useUserState();

  let deviceDispatch = useDeviceDispatch();
  let {loading: loadingDevice, paired} = useDeviceState();

  useEffect(() => {
    isLoading(loadingUser || loadingDevice);
  }, [loadingUser, loadingDevice]);

  //TODO: handlePair, user, etc... load stuff also
  // getDevice by user/device -> if empty paired = false
  // -> if contains 'CULLTIVE' paired = true / getDevice
  // handle no internet connection
  useEffect(() => {}, [paired]);

  //TODO: Handle Network error, loading -> error -> paired etc.
  //TODO; isLoading in Home ?
  // if user only contains e-mail
  //   getUser -- this getUser should not update loading...
  //   should GetUser in background??
  //   handleResponse / Error
  // else if user does not contains device
  //   validate paired = false
  // else if user.device exists
  //   getDevice?
  //   handleResponse / Error
  // setDevice?
  // else
  //   ...

  // This is our very messy Home.tsx state validation function,
  useEffect(() => {
    console.log('Home: user: ' + JSON.stringify(user));

    const keys = Object.keys(user);
    console.log('keys : ' + keys);

    if (keys && keys.length) {
      if (keys.includes('device')) {
        if (user.device.includes('CULLTIVE')) {
          if (paired) {
            console.log('device is paired, doesnt need to getDevice?..');
            isLoading(false);
          } else {
            console.log(
              'device exists on user but state is not paired somehow... figure out device flow',
            );
            getDevice(deviceDispatch, user.device);
          }
        }
      } else if (keys.includes('userId')) {
        if (user.userId === '') {
          console.log('userId == ~ ~ ');
        } else {
          console.log('appnavigator - useffect - else');
        }
      } else if (keys.includes('email') && !keys.includes('userId')) {
        console.log('sign in or signup... getUser');
        getAuthenticatedUser(userDispatch);
        //async await and try catch, handle errors
        isLoading(false);
      }
    } else {
      console.log('keys is empty');
    }
  }, [user]);

  const [modalState, setModalState] = useState(false);
  // FIXME: Open FirstSigninModal if !paired
  // useEffect(() => {
  //   setTimeout(() => {
  //     setModalState(true);
  //   }, 2000);
  // }, [null]);

  const checkPermissionsOnClick = () => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
      }),
    ).then((res: string) => {
      console.log('checkPermissionsOnClick: ' + res);
      switch (res) {
        case 'granted':
          navigation.navigate('PairNavigator', {screen: 'DeviceCertification'});
          break;
        case 'denied':
          navigation.navigate('PairNavigator', {
            screen: 'GrantPermissions',
            params: {permissions: res},
          });
          break;
        case 'blocked':
          navigation.navigate('PairNavigator', {
            screen: 'GrantPermissions',
            params: {permissions: res},
          });
          break;
        case 'unavailable':
          //TODO: Message user explaining / advising unavailability
          break;
        default:
          //...
          break;
      }
    });
  };

  const loadingContainer = (
    <View
      style={{
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <ActivityIndicator
        color={'#3cbc40'}
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );

  const pairContainer = (
    <TouchableHighlight
      onPress={() => {
        checkPermissionsOnClick();
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

  const plantContainer = (
    <View
      style={{
        alignSelf: 'center',
        marginVertical: 8,
        borderRadius: 200,
        width: 200,
        height: 200,
        backgroundColor: someColors.white.color,
        borderColor: someColors.black.color,
        borderWidth: 0.7,
        shadowOffset: 5,
        shadowOpacity: 5,
        shadowRadius: 5,
        shadowColor: someColors.gray.color,
        elevation: 10,
      }}>
      <PlantHomeUndraw width={150} height={200} style={{alignSelf: 'center'}} />
      {/* <PlantHomeUndraw width={200} height={300} style={{alignSelf: 'center'}} /> */}
    </View>
  );

  const logoContainer = (
    <View>
      <Logo width={200} height={200} />
    </View>
  );

  //TODO: LogContext // Activity LogContainer
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

  //TODO: HANDLE ERRORS - NETWORK ERROR FOR HOME, AND SHOW MESSAGE TO THE USER -> LIKE REPORT.tsx

  return (
    <>
      {loading ? (
        loadingContainer
      ) : !paired ? (
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 12,
            justifyContent: 'center',
          }}>
          <View>
            <Text
              style={[
                someStyles.h0,
                someColors.tertiary,
                {textAlign: 'center'},
              ]}>
              Adicionar novo dispositivo
            </Text>
          </View>
          {/*TODO: Ask if user already set up with device pairing*/}
          {/* <FirstSigninModal modalState={modalState} /> */}

          {pairContainer}
        </SafeAreaView>
      ) : (
        <View
          style={[
            someStyles.container_spaced,
            {
              alignItems: 'stretch',
            },
          ]}>
          {/* TODO: LOADING*/}
          {/* {loadingContainer} */}

          {plantContainer}
          {/* {logoContainer} */}

          <Divider style={{marginTop: 8}} />

          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  alignSelf: 'center',
                  borderRadius: 8,
                  width: 8,
                  height: 8,
                  marginEnd: 8,
                  marginTop: 8,
                  marginBottom: 4,
                  backgroundColor: someColors.primary.color,
                }}></View>
              <Text
                style={[
                  someStyles.h4,
                  someColors.tertiary,
                  {fontSize: 15, paddingTop: 8, paddingBottom: 4},
                ]}>
                ATIVIDADES RECENTES
              </Text>
            </View>

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