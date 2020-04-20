import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  ActivityIndicator,
  Button,
  TouchableHighlight
} from "react-native";
import { globalStyles } from "../style/global";
// External Libs
import Fade from "react-native-fade";
// TODO: Implement Modal using this library
// https://github.com/react-native-community/react-native-modal
import Modal from "react-native-modal";
// import { Input } from "react-native-elements";

// Icons
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Hooks
import { useFirebaseDispatch, resetPassword } from "../context/FirebaseContext";
import { useUserDispatch, loginUser, signupUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

// Components & Resources
import InputTextField from "../component/InputTextField";
import logo from "../image/culltive_logo_1500t.png";

export default function LoginScreen() {
  var firebaseDispatch = useFirebaseDispatch();
  var userDispatch = useUserDispatch();

  const navigation = useNavigation();

  const imageHeight = new Animated.Value(220);

  // TODO: handleError (login)
  // TODO: signupUser form / tab
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [errors, setErrors] = useState(null);
  // const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [emailValue, setEmailValue] = useState(""); // for recover email
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [modal, setModal] = React.useState(false);

  const keyboardWillShow = event => {
    Animated.timing(imageHeight, {
      duration: event.duration,
      toValue: 140
    }).start();
  };

  const keyboardWillHide = event => {
    Animated.timing(imageHeight, {
      duration: event.duration,
      toValue: 220
    }).start();
  };

  useEffect(() => {
    console.log("LoginScreen error:" + errors);
    navigation.setOptions({
      title: "Login",
      headerTitle: () => (
        <View style={styles.headerView}>
          <Text
            style={
              (styles.headerTitle,
              {
                color: "#FFF",
                fontWeight: "400",
                fontSize: 26
              })
            }
          >
            Login
          </Text>
        </View>
      )
    });

    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );
    return function cleanup() {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  });

  // TODO: Finish ForgetPw Modal
  // TODO: onModalShow
  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
      <View>
        <Modal
          animationInTiming={400}
          animationOutTiming={600}
          isVisible={modal}
          hideModalContentWhileAnimating={true}
          onBackdropPress={() => setModal(false)}
        >
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModal(false);
                setIsLoadingModal(false);
              }}
            >
              <Ionicons size={60} name="ios-close" />
            </TouchableOpacity>
            <View marginHorizontal={10}>
              <Text
                style={
                  (globalStyles.text,
                  {
                    alignSelf: "center",
                    fontSize: 26,
                    marginTop: 32,
                    marginBottom: 8
                  })
                }
              >
                That's ok :)
              </Text>
              <Text style={(styles.text, { fontSize: 16, marginTop: 32 })}>
                Just type your account's email below!
              </Text>

              <InputTextField
                title="Email"
                placeholder="Type your email"
                placeholderTextColor={errors ? "red" : "gray"}
                selectionColor="#3ea341"
                keyboardType="email-address"
                onChangeText={text => setEmailValue(text)}
                autoCapitalize="none"
                style={{
                  height: 60,
                  fontSize: 40,
                  marginTop: 16,
                  marginBottom: 8
                }}
              ></InputTextField>

              <Text
                style={
                  (styles.text,
                  { fontSize: 16, marginTop: 10, marginBottom: 2 })
                }
              >
                We will send you a reset password link.
              </Text>
            </View>

            <View>
              {isLoadingModal ? (
                <ActivityIndicator
                  style={(styles.activityIndicator, { margin: 10 })}
                  size="large"
                />
              ) : (
                <TouchableOpacity
                  style={[styles.submitContainer, { marginTop: 22 }]}
                  onPress={() => {
                    resetPassword(
                      firebaseDispatch,
                      emailValue,
                      setIsLoadingModal
                    );
                    setIsLoadingModal(true);
                    // async function --
                    // setIsLoadingModal(false);
                    // if (ack) -- e-mail sent, please check your inbox.
                  }}
                >
                  <Text style={[styles.headerTitle]}>Recover Password</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>

      <ScrollView style={styles.container}>
        <View>
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Animated.Image
              source={logo}
              resizeMode="contain"
              style={[styles.logo, { height: imageHeight }]}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity>
              <View style={styles.socialButton}>
                <Ionicons
                  name="logo-facebook"
                  size={20}
                  style={styles.socialLogo}
                ></Ionicons>
                <Text styles={styles.text}> Facebook</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={styles.socialButton}>
                <Ionicons
                  name="logo-google"
                  size={20}
                  style={styles.socialLogo}
                ></Ionicons>
                <Text styles={styles.text}> Google </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              style={[
                styles.text,
                {
                  color: "#ABB4BD",
                  fontSize: 15,
                  textAlign: "center",
                  marginVertical: 20
                }
              ]}
            >
              or
            </Text>

            <InputTextField
              title="Email"
              placeholder={"Type your email address"}
              placeholderTextColor={errors ? "red" : "gray"}
              selectionColor="#3ea341"
              keyboardType="email-address"
              onChangeText={text => setLoginValue(text)}
              autoCapitalize="none"
              style={{
                marginBottom: 6
              }}
            ></InputTextField>

            <InputTextField
              title="Password"
              placeholder={"Type your password"}
              placeholderTextColor={errors ? "red" : "gray"}
              selectionColor="#3ea341"
              secureTextEntry={true}
              onChangeText={text => setPasswordValue(text)}
              style={{
                marginTop: 14,
                marginBottom: 6
              }}
            ></InputTextField>

            {/*Wrong password*/}
            {/*{errors !== null ? (
              <Text style={{ color: "red", alignSelf: "flex-start" }}>
                {errors.password.toString()}
              </Text>
            ) : (
              <Text> </Text>
            )}*/}

            {/*<Input
              label="Email"
              placeholder="Type your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => setLoginValue(text)}
            />

            <Input
              label="Password"
              placeholder="Type your password"
              secureTextEntry={true}
              onChangeText={text => setPasswordValue(text)}
              errorStyle={{ color: "red" }}
              errorMessage={error ? "Something is " : ""}
            />*/}

            <Text
              onPress={() => {
                setModal(true);
              }}
              style={[styles.text, styles.link, { textAlign: "right" }]}
            >
              Forgot Password?
            </Text>

            {errors ? (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  alignSelf: "center",
                  marginTop: 20
                }}
              >
                Something went wrong, please try again
              </Text>
            ) : (
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: 20
                }}
              >
                {" "}
              </Text>
            )}

            <View style={styles.buttonView}>
              {isLoading ? (
                <ActivityIndicator
                  style={styles.activityIndicator}
                  size="large"
                />
              ) : (
                <TouchableOpacity
                  style={styles.submitContainer}
                  onPress={() =>
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      setIsLoading,
                      setErrors
                    )
                  }
                >
                  <Text style={[styles.headerTitle]}>Login</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={[
                styles.text,
                {
                  fontSize: 14,
                  color: "#ABB4BD",
                  textAlign: "center",
                  marginTop: 24
                }
              ]}
            >
              Don't have an account?{" "}
              {/*<TouchableOpacity
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >*/}
              <Text
                onPress={() => {
                  navigation.navigate("Signup");
                }}
                style={[styles.text, styles.link, { marginBottom: 12 }]}
              >
                Register Now
              </Text>
              {/*</TouchableOpacity>*/}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30
  },
  modal: {
    marginVertical: 100,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: "#f9f9f9",
    paddingVertical: 20,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.65,
    elevation: 4
  },
  logo: {
    width: 220,
    height: 220
  },
  text: {
    fontFamily: "Avenir Next",
    color: "#52575D"
  },
  socialButton: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(171, 180, 189, 0.65)",
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5
  },
  socialLogo: {
    marginRight: 6
  },
  closeIcon: {
    color: "#FF1654"
  },
  link: {
    color: "#FF1654",
    fontSize: 14,
    fontWeight: "500"
  },
  submitContainer: {
    backgroundColor: "#3ea341",
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  headerTitle: {
    fontFamily: "Helvetica Neue",
    color: "#f5f5f5",
    fontWeight: "400",
    fontSize: 20
  },
  activityIndicator: {
    marginTop: 12,
    alignSelf: "center",
    justifyContent: "center"
  },
  closeButton: {
    position: "absolute",
    right: "5%",
    color: "#555",
    alignItems: "center",
    justifyContent: "center"
  },
  someImage: {
    marginTop: 48,
    width: 300,
    height: 300,
    borderRadius: 300,
    overflow: "hidden"
  },
  buttonView: {
    width: "100%",
    marginTop: 22,
    alignSelf: "center"
  }
});
