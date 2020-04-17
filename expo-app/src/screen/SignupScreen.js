import React, { useState, useEffect } from "react";
import { globalStyles } from "../styles/global";
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
  ActivityIndicator
} from "react-native";

// External Libs
import Fade from "react-native-fade";

// Icons
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Hooks
import { useUserDispatch, signupUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

// Components & Resources
import InputTextField from "../component/InputTextField";
import logo from "../images/culltive_logo_1500t.png";

export default function SignupScreen() {
  var userDispatch = useUserDispatch();

  const navigation = useNavigation();

  const imageHeight = new Animated.Value(220);

  // TODO: handleError (signup)
  // TODO: signupUser form / tab
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [userNameValue, setUserNameValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

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
    navigation.setOptions({
      title: "",
      headerTitle: () => (
        <View style={styles.headerView}>
          <Text
            style={
              (styles.headerTitle,
              {
                color: "#FFF",
                fontWeight: "400",
                fontSize: 22
              })
            }
          >
            Create your Account
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

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
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

          {/*Signup with Facebook / Google?*/}
          {/*<View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center"
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
          </View>*/}

          <View>
            <InputTextField
              title="Name"
              placeholder={"Type your name and surname"}
              placeholderTextColor={errors ? "red" : "gray"}
              keyboardType="default"
              onChangeText={text => setUserNameValue(text)}
              autoCapitalize="none"
              selectionColor="#3ea341"
              style={{
                marginTop: 12,
                marginBottom: 6
              }}
            ></InputTextField>
            <InputTextField
              title="Email"
              placeholder={"Type your email address"}
              placeholderTextColor={errors ? "red" : "gray"}
              keyboardType="email-address"
              onChangeText={text => setLoginValue(text)}
              autoCapitalize="none"
              selectionColor="#3ea341"
              style={{
                marginTop: 14,
                marginBottom: 6
              }}
            ></InputTextField>
            <InputTextField
              title="Password"
              placeholder={"Type your password"}
              placeholderTextColor={errors ? "red" : "gray"}
              secureTextEntry={true}
              onChangeText={text => setPasswordValue(text)}
              selectionColor="#3ea341"
              style={{
                marginTop: 14,
                marginBottom: 6
              }}
            ></InputTextField>

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
                    signupUser(
                      userDispatch,
                      userNameValue,
                      loginValue,
                      passwordValue,
                      setIsLoading,
                      setErrors
                    )
                  }
                >
                  <Text style={[globalStyles.headerTitle]}>Signup</Text>
                </TouchableOpacity>
              )}
            </View>
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
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  activityIndicator: {
    paddingVertical: 12,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonView: {
    width: "100%",
    alignSelf: "center"
  }
});
