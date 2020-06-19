import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Settings from '../screen/Settings';

const Stack = createStackNavigator();

const SettingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
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
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
