import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

// Context
import {DataProvider} from './context/DataContext';
import {DeviceProvider} from './context/DeviceContext';
import {UserProvider} from './context/UserContext';
import {FirebaseProvider} from './context/FirebaseContext';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';

// API
import api from 'axios';
api.defaults.baseURL = 'https://us-central1-culltive.cloudfunctions.net/api';

const App: React.FC = () => {
  console.log('-- App.tsx');

  return (
    <FirebaseProvider>
      <DataProvider>
        <DeviceProvider>
          <UserProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </UserProvider>
        </DeviceProvider>
      </DataProvider>
    </FirebaseProvider>
  );
};

export default App;
