import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import DrawerNavigator from './DrawerNavigator';

// Hooks
import {useUserDispatch, signOut} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
// } from '@react-navigation/drawer';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

// Screens
import Home from '../screen/Home';
import Report from '../screen/Report';
import Chart from '../screen/Chart';
import Settings from '../screen/Settings';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import {someStyles} from '../Styles';

const Stack = createStackNavigator();

// const DrawerButton = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={{flexDirection: 'row'}}>
//       <TouchableOpacity
//         onPress={() => {
//           // navigation.navigate('DrawerOpen');
//           navigation.setOptions;
//         }}>
//         <Ionicons
//           name="md-menu"
//           style={someStyles.headerButton}
//           size={24}
//           color="#fff"
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

const HomeNavigator: React.FC = () => {
  console.log('-- HomeNavigator.tsx');

  const navigation = useNavigation();
  // navigation.setOptions({
  //   headerRight: () => (
  //     <DoneButton
  //       onPress={async () => {
  //         await saveNote();
  //         navigation.replace('Notes');
  //       }}
  //     />
  //   ),
  // });

  const DrawerButton = (props: any) => {
    const navigation = useNavigation();
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            // props.navigation.openDrawer();
            // navigation.openDrawer();
          }}>
          <Ionicons
            name="md-menu"
            style={someStyles.headerButton}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
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
        options={() => ({
          title: 'Home',
          headerTitle: () => (
            <View style={someStyles.headerView}>
              <Text style={someStyles.headerTitle}>Inicio</Text>
            </View>
          ),
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
        }}
      />
      <Stack.Screen
        name="Chart"
        component={Chart}
        options={{
          headerTitle: () => <View style={someStyles.headerView} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

// options={({navigation}) => ({
//   headerRight: (props) => {
//     return (
//       <Button
//         title={'oi'}
//         onPress={() => navigation.toggleDrawer()}></Button>
//     );
//   },
// })}

// headerRight: () => (
//   <Ionicons
//     name="ios-information-circle"
//     style={someStyles.headerButton}
//     size={24}
//     color="#fff"
//     onPress={() => alert('Info Button')}
//   />
// ),

//  headerLeft: <DrawerButton navigation={navigation} />,

// <Ionicons
//   name="md-menu"
//   style={someStyles.headerButton}
//   size={24}
//   color="#fff"
//   onPress={() => {
//     navigation.navigate('DrawerOpen');
//     // navigation.toggleDrawer();
//   }}
// />

// headerRight: () => (
//   <Ionicons
//     name="ios-calendar"
//     style={someStyles.headerButton}
//     size={24}
//     color="#fff"
//     onPress={() => alert('Calendar Button')}
//     // TODO: contextData / contextApp / contextUI / ??
//     // setCalendarView(true) in ReportScreen
//     // create an access to Report child component being able to change its state
//     // ...
//   />
// ),

// FIXME:
// console.log('try openDrawer...');
// navigation.openDrawer();
// console.log('nice!');

// const DrawerButton = (props: any) => {
//   return (
//     <View>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.setOptions
//         }}>
//         <Ionicons
//           name="md-menu"
//           style={someStyles.headerButton}
//           size={24}
//           color="#fff"
//           // onPress={() => {
//           //   // navigation.navigate('DrawerOpen');
//           //   props.navigation.toggleDrawer();
//           // }}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

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

// options={(props) => {
//   return {
//     headerStyle: {
//       backgroundColor: '#00a5f0',
//     },
//     headerTintColor: '#ffffff',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//     headerLeftContainerStyle: {},
//     headerLeft: (
//       <TouchableOpacity
//         onPress={() => props.navigation.openDrawer()}
//         style={{
//           flex: 1,
//           width: 49,
//           height: 20,
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: 'transparent',
//         }}
//         title="X"
//         color="#fff">
//         <Ionicons name="md-menu" />
//       </TouchableOpacity>
//     ),
//   };
// }}
