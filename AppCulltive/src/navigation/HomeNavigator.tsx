import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
// DrawerActions,

// Hooks
import {useUserDispatch, signOut} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// Components & Resources
import Home from '../screen/Home';
import Report from '../screen/Report';
import Chart from '../screen/Chart';

// FIXME:
// Settings is responsible for the INVALID HOOK CALL
import Settings from '../screen/Settings';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {someStyles} from '../Styles';

const Stack = createStackNavigator();

//FIXME: It seems that CustomDrawer and DrawerNavigation itself is not working properly
// iconButton click - crashes
// signOut dispatch() - ?
// drawerItem click warns and refreshes...
const HomeNavigator: React.FC = () => {
  // console.log("-- HomeNavigator.tsx")

  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  let userDispatch = useUserDispatch();
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Signout"
          onPress={() => {
            signOut(userDispatch);
          }}
        />
      </DrawerContentScrollView>
    );
  };

  //FIXME: warning cant update state on unmounted component (line 51)
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        drawerType={
          Dimensions.get('window').width > 900 ? 'permanent' : 'front'
        }
        drawerContentOptions={{
          activeTintColor: '#3ea341',
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Settings" component={Report} />
      </Drawer.Navigator>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
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
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{
          title: 'Home',
          headerTitle: () => (
            <View style={someStyles.headerView}>
              <Text style={someStyles.headerTitle}>Inicio</Text>
            </View>
          ),
          headerLeft: () => (
            <Ionicons
              name="md-menu"
              style={someStyles.headerButton}
              size={24}
              color="#fff"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
          headerRight: () => (
            <Ionicons
              name="ios-calendar"
              style={someStyles.headerButton}
              size={24}
              color="#fff"
              onPress={() => alert('Calendar Button')}
              // TODO: contextData / contextApp / contextUI / ??
              // setCalendarView(true) in ReportScreen
              // create an access to Report child component being able to change its state
              // ...
            />
          ),
        }}
      />
      <Stack.Screen
        name="Chart"
        component={Chart}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
          headerRight: () => (
            <Ionicons
              name="ios-information-circle"
              style={someStyles.headerButton}
              size={24}
              color="#fff"
              onPress={() => alert('Info Button')}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

// Styles for a subTitle in the header
/*<Text
  style={
    (someStyles.headerSubtitle,
    {
      color: '#FFF',
      fontWeight: '300',
      fontSize: 14,
    })
  }>
  Acacia Imperial
</Text>*/

// const Drawer = createDrawerNavigator();

// props.navigation.closeDrawer()
// FIXME: Drawer navigator somehow was creating the Invalid hook call error
// function CustomDrawerContent(props) {
//   var userDispatch = useUserDispatch();
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem
//         label="Signout"
//         onPress={() => {
//           signOut(userDispatch);
//         }}
//       />
//     </DrawerContentScrollView>
//   );
// }

// function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       drawerType={Dimensions.get('window').width > 900 ? 'permanent' : 'front'}
//       drawerContentOptions={{
//         activeTintColor: '#3ea341',
//       }}
//       drawerContent={(props) => <CustomDrawerContent {...props} />}>
//       <Drawer.Screen name="Home" component={Home} />
//       <Drawer.Screen name="Settings" component={Settings} />
//     </Drawer.Navigator>
//   );
// }

// const config = {
//   animation: 'spring',
//   config: {
//     stiffness: 1000,
//     damping: 50,
//     mass: 3,
//     overshootClamping: false,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };
//
// const closeConfig = {
//   animation: 'timing',
//   config: {
//     duration: 500,
//     easing: Easing.linear,
//   },
// };
