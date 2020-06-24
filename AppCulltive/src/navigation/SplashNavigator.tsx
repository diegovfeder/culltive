import React from 'react';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Splash from '../screen/Splash';

const Stack = createStackNavigator();

const SplashNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
};

export default SplashNavigator;
