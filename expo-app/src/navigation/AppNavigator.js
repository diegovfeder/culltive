import * as React from "react";
import { AsyncStorage } from "react-native";

// Navigation
// import { NavigationContainer } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators
} from "@react-navigation/stack";

// Icons
// import { Ionicons } from "@expo/vector-icons";

// Context API
import { useUserDispatch, validateToken } from "../context/UserContext";
import { useUserState } from "../context/UserContext";

//General Imports
import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";
import SplashScreen from "../screen/SplashScreen";

export default function AppNavigator() {
  var userDispatch = useUserDispatch();
  var { isAuthenticated, isLoading } = useUserState();

  console.log("AppNavigator: isAuth: " + isAuthenticated);
  console.log("AppNavigator: isLoad: " + isLoading);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem("FBIdToken");
      } catch (e) {
        console.log("AppNavigator:  Restoring token failed");
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({ type: "RESTORE_TOKEN", token: userToken });
      console.log("AppNavigator: userToken: " + userToken);
      validateToken(userDispatch, userToken);
    };
    bootstrapAsync();
  }, []);

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: "horizontal"
      }}
    >
      {isLoading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : isAuthenticated ? (
        <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
      ) : (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

// const styles = StyleSheet.create({
//   headerButton: {
//     marginHorizontal: 20,
//     paddingHorizontal: 10
//   }
// });

const Stack = createStackNavigator();

// const config = {
//   animation: "spring",
//   config: {
//     stiffness: 1000,
//     damping: 50,
//     mass: 3,
//     overshootClamping: false,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01
//   }
// };

// const closeConfig = {
//   animation: "timing",
//   config: {
//     duration: 500,
//     easing: Easing.linear
//   }
// };

// {/*{isAuthenticated ? (*/}
// <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
// {/*) : (*/}
// <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
// {/*)}*/}
