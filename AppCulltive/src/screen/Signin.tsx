import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {useFirebaseDispatch, resetPassword} from '../context/FirebaseContext';
import {useUserDispatch, signinUser} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// Components
import Logo from '../component/Logo'; //TODO: create & change to assets
import {Input} from 'react-native-elements';
import ForgotPasswordModal from '../component/ForgotPasswordModal';
import EmailSentModal from '../component/EmailSentModal';

// Styles
import {someStyles} from '../Styles';

// TODO: Linking openURL && openSettings
// const supportedURL = 'https://google.com';
// const unsupportedURL = 'slack://open?team=123456';

// TODO: Fix modalState. maybe embbed code from import
const Signin: React.FC = () => {
  console.log('-- Signin.tsx');

  let _emailInput;
  let _passwordInput;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [modalState, setModalState] = useState(false); //FIXME: odd state res
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState(null); // connection Errors coming from userContext

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Já possuo cadastro</Text>
        </View>
      ),
    });
    // if (_emailInput) {
    //   // _emailInput.shake();
    //   _emailInput.focus();
    // }
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <KeyboardAvoidingView
        style={someStyles.keyboardContainer}
        behavior="padding">
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Email inválido')
              .required('*Obrigatório'),
            password: Yup.string().required('*Obrigatório'),
          })}
          onSubmit={(values) => {
            console.log(JSON.stringify(values));
            signinUser(userDispatch, values.email, values.password, setLoading);
          }}>
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
                errorMessage={errors.email ? errors.email : ''}
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
                style={{justifyContent: 'center', alignSelf: 'flex-end'}}
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
                {loading ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Text style={[someStyles.textButton]}>Continuar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signin;
