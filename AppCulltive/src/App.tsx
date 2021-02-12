import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import messaging from '@react-native-firebase/messaging';

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

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
  }, []);

  //TODO: Handle all contexts better or change ro redux-saga :/
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
