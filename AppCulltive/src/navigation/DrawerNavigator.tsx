import React, {useEffect} from 'react';
import {Dimensions, TouchableOpacity, Text, View} from 'react-native';

// Hooks
import {useDeviceState} from '../context/DeviceContext';
import {
  useUserDispatch,
  useUserState,
  signOut,
  getUser,
} from '../context/UserContext';
import {
  useNavigation,
  NavigationAction,
  DrawerActions,
} from '@react-navigation/native';

// Navigator / Screens
import HomeNavigator from './HomeNavigator';
import SettingsNavigator from './SettingsNavigator';

//... Devices, Help,

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

//https://stackoverflow.com/questions/54222472/react-native-undefined-is-not-a-function-evaluating-navigation-opendrawer
// import { DrawerActions } from 'react-navigation'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import {someStyles} from '../Styles';

export const DrawerButton = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Ionicons
          name="md-menu"
          style={someStyles.headerButton}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

export const DrawerNavigator: React.FC = ({nav, route}) => {
  console.log('*** DrawerNavigator.tsx ***');
  let userDispatch = useUserDispatch();

  const {paired} = useDeviceState();

  let {token, user} = useUserState();
  console.log('user: ' + user + ' // user.split(): ' + user.split());

  //TODO: IF CONNECTED TO ESP8266 VIA SOFT AP DONT CALL THE GET FUNCTION... OR ANY CALL TO API BECAUSE,
  // YOU KNOW... IT WONT WORK
  // Idea: Maybe develop a handler for these type of connection stuff...

  useEffect(() => {
    console.log('user useEffect()');
    if (user === '') {
      console.log('getUser');
      getUser(userDispatch, token);
    }
  }, [user]);

  // const navigation = useNavigation();

  const Drawer = createDrawerNavigator();

  const _getRouteStateFromIndex = (route) => {
    if (typeof route.state === 'undefined') {
      return true;
    } else {
      // console.log('route.state' + JSON.stringify(route.state));
      return route.state.index > 0 ? false : true;
    }
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props}>
        {/* TODO: Create a header for the Drawer */}
        <View style={someStyles.container}>
          <Text style={someStyles.h2}>Bem vindo!</Text>
          <Text style={someStyles.h3}>{user}</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Sair"
          onPress={() => {
            signOut(userDispatch);
          }}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      edgeWidth={384}
      drawerStyle={{width: 256}}
      drawerType={Dimensions.get('window').width > 900 ? 'permanent' : 'front'}
      drawerContentOptions={{
        activeTintColor: '#3ea341',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Início"
        component={HomeNavigator}
        options={({route}) => ({swipeEnabled: _getRouteStateFromIndex(route)})}
      />
      {paired ? (
        <Drawer.Screen name="Configurações" component={SettingsNavigator} />
      ) : null}
      {/* TODO: Create a buy this product Drawer.Screen */}
    </Drawer.Navigator>
  );
};
