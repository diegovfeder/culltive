import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

import {DataProvider} from './context/DataContext';
import {UserProvider} from './context/UserContext';
import {FirebaseProvider} from './context/FirebaseContext';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';

import axios from 'axios';

// FIXME: Change and make something work
// axios.defaults.baseURL = 'https://us-central1-culltive.cloudfunctions.net/api';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <FirebaseProvider>
      <DataProvider>
        <UserProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </DataProvider>
    </FirebaseProvider>
  );
};

export default App;
