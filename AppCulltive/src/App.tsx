import 'react-native-gesture-handler';
import React from 'react';

// Context
import {ReadingProvider} from './context/ReadingContext';
import {DeviceProvider} from './context/DeviceContext';
import {UserProvider} from './context/UserContext';
import {FirebaseProvider} from './context/FirebaseContext';

//TODO:
// import {LogsProvider} from './context/LogContext';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  console.log('|| App.tsx ||');

  return (
    <FirebaseProvider>
      <ReadingProvider>
        <DeviceProvider>
          <UserProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </UserProvider>
        </DeviceProvider>
      </ReadingProvider>
    </FirebaseProvider>
  );
};

export default App;
