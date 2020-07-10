import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import PlantProfile from './PlantProfile';

const Stack = createStackNavigator();

const PlantNavigator: React.FC = () => {
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
      <Stack.Screen name="PlantProfile" component={PlantProfile} />
    </Stack.Navigator>
  );
};

export default PlantNavigator;
