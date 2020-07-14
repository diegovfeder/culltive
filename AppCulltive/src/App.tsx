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
      <UserProvider>
        <DeviceProvider>
          <ReadingProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ReadingProvider>
        </DeviceProvider>
      </UserProvider>
    </FirebaseProvider>
  );
};

export default App;
