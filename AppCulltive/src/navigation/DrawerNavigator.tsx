import React, {useEffect} from 'react';
import {Dimensions, TouchableOpacity, Text, View} from 'react-native';

// Hooks
import {useDeviceState} from '../context/DeviceContext';
import {
  useUserDispatch,
  useUserState,
  signOut,
  getAuthenticatedUser,
} from '../context/UserContext';
import {
  useNavigation,
  NavigationAction,
  DrawerActions,
} from '@react-navigation/native';

// Navigator / Screens
import HomeNavigator from './HomeNavigator';
import SettingsNavigator from '../screen/drawer/settings/SettingsNavigator';
import PlantNavigator from '../screen/drawer/plantprofile/PlantNavigator';

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
  console.log('... DrawerNavigator.tsx ...');

  const userDispatch = useUserDispatch();
  const {user} = useUserState();

  const {paired} = useDeviceState();

  const Drawer = createDrawerNavigator();

  const _getRouteStateFromIndex = (route: any) => {
    if (typeof route.state === 'undefined') {
      return true;
    } else {
      return route.state.index > 0 ? false : true;
    }
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props}>
        {/* TODO: Create a header for the Drawer */}
        <View style={someStyles.container}>
          <Text style={someStyles.h2}>Bem vindo!</Text>
          {user.email !== undefined ? (
            <Text style={[someStyles.h3, {marginVertical: 4}]}>
              {user.email}
            </Text>
          ) : (
            <></>
          )}
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
      ) : // <Drawer.Screen name="Sua planta" component={PlantNavigator} />

      null}
      {/* TODO: Create a buy this product Drawer.Screen */}
    </Drawer.Navigator>
  );
};
