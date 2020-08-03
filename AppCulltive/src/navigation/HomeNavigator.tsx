import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

// Navigators || Screens
import PairNavigator from './PairNavigator';
import Home from '../screen/home/Home';
import Report from '../screen/home/Report';
import Chart from '../screen/home/Chart';
// import {DrawerButton} from './DrawerNavigator';

// Context
// import {useUserDispatch, signOut} from '../context/UserContext';

// Assets
import {someStyles} from '../Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const HomeNavigator: React.FC = () => {
  console.log('-- HomeNavigator.tsx');

  const navigation = useNavigation();

  const DrawerButton = (props: any) => {
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

  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="float"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerStyle: {
          backgroundColor: '#3cbc40',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={() => ({
          title: 'Home',
          headerTitle: () => (
            <View style={someStyles.headerView}>
              <Text style={someStyles.headerTitle}>Inicio</Text>
            </View>
          ),
          headerLeft: () => <DrawerButton />,
        })}
      />
      <Stack.Screen
        name="PairNavigator"
        component={PairNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
        }}
      />
      <Stack.Screen
        name="Chart"
        component={Chart}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
