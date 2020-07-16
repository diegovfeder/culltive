import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {Input} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {useNavigation} from '@react-navigation/native';
import {
  useUserDispatch,
  useUserState,
  signinUser,
  clearError,
} from '../../context/UserContext';

//TODO: reset Password modal and action.
import {
  useFirebaseDispatch,
  resetPassword,
} from '../../context/FirebaseContext';

// TODO: Finish emailSent / forgotPassword state process
import ForgotPasswordModal from '../../component/ForgotPasswordModal';
// import EmailSentModal from '../component/EmailSentModal';

// Assets
import {someStyles} from '../../Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

//TODO: Timeout and retry signIn()
const Signin: React.FC = () => {
  console.log('-- Signin.tsx');

  let _emailInput: any;
  let _passwordInput: any;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [secureTextState, setSecureTextState] = React.useState(true);
  const [eyeState, setEyeState] = React.useState(true);

  //FIXME: handle modal state using context
  const [modalState, setModalState] = useState(false);

  let {error} = useUserState();

  //TODO: Transform error responses into text
  // Network Error -> Verifique sua conexao com a internet
  // Request failed with status code 401 -> Verifique se suas credenciais foram digitadas corretamente
  // ...
  useEffect(() => {
    const _handleContextErrors = () => {
      if (typeof error === 'undefined' || error === null) {
        //...
      } else {
        console.log('signin() : ' + error);
        Alert.alert(
          'Ops...',
          'Encontramos um problema durante a autenticação.' + '\n\n' + error,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                clearError(userDispatch);
              },
            },
          ],
          {cancelable: false},
        );
      }
    };
    return _handleContextErrors();
  }, [error]);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Já possuo cadastro</Text>
        </View>
      ),
    });
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
            // console.log(JSON.stringify(values));
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
                onSubmitEditing={() => {
                  _passwordInput.focus();
                }}
                blurOnSubmit={false}
              />
              <View>
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
                  secureTextEntry={secureTextState}
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  style={{left: '90%', top: '20%', position: 'absolute'}}
                  onPress={() => {
                    setSecureTextState(!secureTextState);
                    setEyeState(!eyeState);
                  }}>
                  <Ionicons
                    name={eyeState ? 'ios-eye' : 'ios-eye-off'}
                    size={24}
                    color="#3ea341"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{justifyContent: 'flex-end', alignSelf: 'flex-end'}}
                onPress={() => {
                  setModalState(!modalState);
                }}>
                <Text style={someStyles.textLink}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              <ForgotPasswordModal modalState={modalState} />
              {/* TODO: Finish firebaseForgotPassword mehtod and modal activity progress*/}
              {/*<EmailSentModal modalState={!modalState} />*/}

              <TouchableHighlight
                onPress={handleSubmit}
                style={someStyles.button}
                underlayColor="#3ea341"
                activeOpacity={1}>
                {loading ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Text style={[someStyles.textButton]}>Continuar</Text>
                )}
              </TouchableHighlight>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signin;
