import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, MaskedViewIOS, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserState } from "../context/UserContext";

export default function SplashScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(new Animated.Value(0));
  const [animation, setAnimation] = useState(false);

  var { isAuthenticated } = useUserState();
  // const [isAuthenticated, setAuthenticated] = useState(false);

  const colorLayer = animation ? null : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#3ea341" }]} />
  );
  const whiteLayer = animation ? null : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFF" }]} />
  );

  useEffect(() => {
    Animated.timing(loading, {
      toValue: 400,
      duration: 2000,
      useNativeDriver: true,
      delay: 400
    }).start(() => {
      setAnimation(true);
    });
  });

  const imageScale = {
    transform: [
      {
        scale: loading.interpolate({
          inputRange: [0, 15, 100],
          outputRange: [0.1, 0.06, 16]
        })
      }
    ]
  };

  const opacity = {
    opacity: loading.interpolate({
      inputRange: [0, 25, 50],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    })
  };

  return (
    <View style={styles.container}>
      {colorLayer}
      <MaskedViewIOS
        style={{ flex: 1 }}
        maskElement={
          <View style={styles.centered}>
            <Animated.Image
              source={require("../image/leaves.png")}
              style={[{ width: 1000 }, imageScale]}
              resizeMode="contain"
            />
          </View>
        }
      >
        {whiteLayer}
        <Animated.View style={[opacity, styles.centered]}></Animated.View>
      </MaskedViewIOS>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

// FIXME: Facebook authentication // Code shared from instamobile
// async tryToLoginFirst() {
//     const email = await AsyncStorage.getItem("@loggedInUserID:key");
//     const password = await AsyncStorage.getItem("@loggedInUserID:password");
//     const id = await AsyncStorage.getItem("@loggedInUserID:id");
//     if (
//       id != null &&
//       id.length > 0 &&
//       password != null &&
//       password.length > 0
//     ) {
//       firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password)
//         .then(user => {
//           const { navigation } = this.props;
//           firebase
//             .firestore()
//             .collection("users")
//             .doc(id)
//             .get()
//             .then(function(doc) {
//               var dict = {
//                 id: id,
//                 email: email,
//                 profileURL: doc.photoURL,
//                 fullname: doc.displayName
//               };
//               if (doc.exists) {
//                 navigation.dispatch({
//                   type: "Login",
//                   user: dict
//                 });
//               }
//             })
//             .catch(function(error) {
//               const { code, message } = error;
//               alert(message);
//             });
//           this.state.isLoading = false;
//         })
//         .catch(error => {
//           const { code, message } = error;
//           alert(message);
//           // For details of error codes, see the docs
//           // The message contains the default Firebase string
//           // representation of the error
//         });
//       return;
//     }
//     const fbToken = await AsyncStorage.getItem(
//       "@loggedInUserID:facebookCredentialAccessToken"
//     );
//     if (id != null && id.length > 0 && fbToken != null && fbToken.length > 0) {
//       const credential = firebase.auth.FacebookAuthProvider.credential(fbToken);
//       firebase
//         .auth()
//         .signInWithCredential(credential)
//         .then(result => {
//           var user = result.user;
//           var userDict = {
//             id: user.uid,
//             fullname: user.displayName,
//             email: user.email,
//             profileURL: user.photoURL
//           };
//           this.props.navigation.dispatch({
//             type: "Login",
//             user: userDict
//           });
//         })
//         .catch(error => {
//           this.setState({ isLoading: false });
//         });
//       return;
//     }
//     this.setState({ isLoading: false });
//   }
