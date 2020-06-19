import React from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
} from 'react-native';

// Hooks
import {useUserDispatch, signOut} from '../context/UserContext';

// Navigation
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

// Navigators || Screens
// import {DrawerButton} from './DrawerNavigator';
import PairNavigator from './PairNavigator';
import Home from '../screen/Home';
import Report from '../screen/Report';
import Chart from '../screen/Chart';

// Assets
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import {someStyles} from '../Styles';

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
