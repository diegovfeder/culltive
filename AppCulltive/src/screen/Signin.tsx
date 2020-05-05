import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Linking,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {useFirebaseDispatch, resetPassword} from '../context/FirebaseContext';
import {useUserDispatch, signinUser, signupUser} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {useAsyncStorage} from '../util/useAsyncStorage';
// TODO: Finish this useAsyncStorage thing...
// const [qrCode, setQrCode] = useAsyncStorage("qrCode", "CB-XXXX");

// Components
import InputTextField from '../component/InputTextField';
import {Input} from 'react-native-elements';
import Logo from '../component/Logo';
import ForgotPasswordModal from '../component/ForgotPasswordModal';
import EmailSentModal from '../component/EmailSentModal';
// import {CulltiveButton} from '../component/CulltiveButton';

// Styles
import {someStyles} from '../Styles';

// TODO: Linking openURL && openSettings
// const supportedURL = 'https://google.com';
// const unsupportedURL = 'slack://open?team=123456';

// TODO: Fix modalState. maybe embbed code from import
const Signin: React.FC = () => {
  var userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handlePress = useCallback(async () => {
  //   //Checking if the link is supported for links with custom URL scheme
  //   const supported = await Linking.canOpenURL(url);
  //
  //   if (supported) {
  //   }
  // });

  // useEffect(() => {
  //   if (_emailInput) {
  //     // _emailInput.shake();
  //     _emailInput.focus();
  //   }
  // });

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
      <View style={{marginHorizontal: 16}}>
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Email inválido')
              .required('*Obrigatório'),
            password: Yup.string().required('*Obrigatório'),
          })}
          onSubmit={(values) =>
            signinUser(userDispatch, values.email, values.password, setLoading)
          }>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <Input
                ref={(component) => (_emailInput = component)}
                autoFocus
                autoCapitalize="none"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                errorStyle={{color: 'red'}}
                errorMessage={errors.email && touched.email ? errors.email : ''}
              />
              <Input
                ref={(component) => (_passwordInput = component)}
                placeholder="Senha"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorStyle={{color: 'red'}}
                errorMessage={
                  errors.password && touched.password ? errors.password : ''
                }
                secureTextEntry={true}
              />

              <TouchableOpacity
                onPress={() => {
                  setModalState(!modalState);
                }}>
                <Text style={someStyles.textLink}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              <ForgotPasswordModal modalState={modalState} />
              {/* // TODO: Finish forgot password - send email flow*/}
              {/*<EmailSentModal modalState={!modalState} />*/}

              <TouchableOpacity
                style={someStyles.button}
                onPress={handleSubmit}>
                <Text style={someStyles.textButton}>Continuar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Signin;

// () => {
//   if (_emailInput.isFocused()) {
//     _passwordInput.focus();
//   } else {
//     handleSubmit();
//   }
// }

// <InputTextField
//   title="Email"
//   placeholder={'Type your email address'}
//   onChangeText={handleChange('email')}
//   placeholderTextColor={errors ? 'red' : 'gray'}
//   selectionColor="#3ea341"
//   keyboardType="email-address"
//   autoCapitalize="none"
//   onBlur={handleBlur('email')}
//   value={values.email}
// />
// <InputTextField
//   title="Password"
//   placeholder={'Type your password'}
//   placeholderTextColor={errors ? 'red' : 'gray'}
//   selectionColor="#3ea341"
//   onChangeText={handleChange('password')}
//   onBlur={handleBlur('password')}
//   value={values.password}
// />

// const keyboardWillShow = (event) => {
//   Animated.timing(imageHeight, {
//     duration: event.duration,
//     toValue: 140,
//   }).start();
// };
//
// const keyboardWillHide = (event) => {
//   Animated.timing(imageHeight, {
//     duration: event.duration,
//     toValue: 220,
//   }).start();
// };
//
// useEffect(() => {
//   const keyboardWillShowSub = Keyboard.addListener(
//     'keyboardWillShow',
//     keyboardWillShow,
//   );
//   const keyboardWillHideSub = Keyboard.addListener(
//     'keyboardWillHide',
//     keyboardWillHide,
//   );
//   return function cleanup() {
//     keyboardWillShowSub.remove();
//     keyboardWillHideSub.remove();
//   };
// });

// <InputTextField
//   title="Email"
//   placeholder={'Type your email address'}
//   placeholderTextColor={errors ? 'red' : 'gray'}
//   selectionColor="#3ea341"
//   keyboardType="email-address"
//   onChangeText={(text) => setLoginValue(text)}
//   autoCapitalize="none"
//   style={{
//     marginBottom: 6,
//   }}
// />
