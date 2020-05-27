import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import SplashScreen from "../screen/SplashScreen";

import Welcome from '../screen/Welcome';
import Terms from '../screen/Terms';
import Signin from '../screen/Signin';
import Signup from '../screen/Signup';

const Stack = createStackNavigator();

// Customized by props...
// options={{ headerTitle: props => <LogoTitle {...props} /> }}
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      headerMode="float"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerStyle: {
          backgroundColor: '#3cbc40',
          elevation: 4,
          shadowOpacity: 100,
          // borderBottomWidth: 1,
        },
        headerTintColor: '#f6f7f8',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#f6f7f8',
          },
          headerTitle: () => <View style={styles.headerView} />,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerTitle: () => <View style={styles.headerView} />}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
});

export default AuthNavigator;
