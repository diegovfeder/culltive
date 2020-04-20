import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: "#3ea341" }]}>
      <View style={styles.centered}>
        <Image
          source={require("../image/culltive_logo_1500t.png")}
          borderColor="#FFF"
          style={{ width: 400, height: 400 }}
        />
      </View>
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

// {isLoading
//   ? isAuthenticated
//     ? navigation.navigate("AuthNavigator", { screen: "Login" })
//     : navigation.navigate("AppNavigator", { screen: "Home" })
//   : null}
// {console.log("Auth: " + isAuthenticated)}

// {/*TODO:
//   - Verify if already logged in
//     - NO? Branch to Login / Register
//     - YES? Await/load data - go to Home
//   Load data from */}
// {/*tryToLoginFirst*/}
//
// {isAuthenticated
//   ? navigation.navigate("AppNavigator", { screen: "Home" })
//   : navigation.navigate("AppNavigator", { screen: "Login" })}

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
