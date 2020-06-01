import React from 'react';
import {Dimensions, TouchableOpacity, Text, View} from 'react-native';

import HomeNavigator from './HomeNavigator';

// Hooks
import {useUserDispatch, signOut} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// Screens
import Home from '../screen/Home';
import Settings from '../screen/Settings';
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

const CustomDrawerContent = (props: any) => {
  let userDispatch = useUserDispatch();
  return (
    <DrawerContentScrollView {...props}>
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

const DrawerNavigator: React.FC = () => {
  console.log('-- DrawerNavigator.tsx');

  const navigation = useNavigation();

  const Drawer = createDrawerNavigator();

  const DrawerButton = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            // navigation.toggleDrawer();
            // navigation.setOptions;
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

  return (
    <Drawer.Navigator
      edgeWidth={192}
      drawerStyle={{width: 256}}
      drawerType={Dimensions.get('window').width > 900 ? 'permanent' : 'front'}
      drawerContentOptions={{
        activeTintColor: '#3ea341',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Início" component={HomeNavigator} />
      <Drawer.Screen
        name="Configurações"
        component={Settings}
        options={() => ({
          title: 'Home',
          headerTitle: () => (
            <View style={someStyles.headerView}>
              <Text style={someStyles.headerTitle}>Configurações</Text>
            </View>
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
