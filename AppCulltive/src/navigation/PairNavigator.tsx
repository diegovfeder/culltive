import React from 'react';
import {View} from 'react-native';

// Navigation
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

// Screens
import GrantPermissions from '../screen/pair/GrantPermissions';
import DeviceCertification from '../screen/pair/DeviceCertification';
import WiFiCredentials from '../screen/pair/WiFiCredentials';
import ConnectionHandshake from '../screen/pair/ConnectionHandshake';
import Fail from '../screen/pair/Fail';
import Confirmation from '../screen/pair/Confirmation';
import DataAgreements from '../screen/pair/DataAgreements';

// import ConnectDevice from '../screen/ConnectDevice';

//TODO: Google chromecast pair process*
// import LookingForDevices from '../screen/pair/LookingForDevices';
// import DeviceFound from '../screen/pair/DeviceFound';
// import DeviceNotFound from '../screen/pair/DeviceNotFound';
// import DeviceVerification from '../screen/pair/DeviceVerification';

import PlantProfile from '../screen/drawer/plantprofile/PlantProfile';

const Stack = createStackNavigator();

const PairNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Pair"
      headerMode="float"
      screenOptions={{
        ...TransitionPresets.ScaleFromCenterAndroid,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerShown: false,
      }}>
      <Stack.Screen
        name="GrantPermissions"
        component={GrantPermissions}
        // options={{headerTitle: () => <View style={styles.headerView} />}}
      />
      <Stack.Screen
        name="DeviceCertification"
        component={DeviceCertification}
      />
      <Stack.Screen name="WiFiCredentials" component={WiFiCredentials} />
      <Stack.Screen
        name="ConnectionHandshake"
        component={ConnectionHandshake}
      />
      <Stack.Screen name="Fail" component={Fail} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="DataAgreements" component={DataAgreements} />
      <Stack.Screen name="PlantProfile" component={PlantProfile} />
    </Stack.Navigator>
  );
};

export default PairNavigator;
