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
  clearErrors,
} from '../context/UserContext';
import {useFirebaseDispatch, resetPassword} from '../context/FirebaseContext';

// Components
import ForgotPasswordModal from '../component/ForgotPasswordModal';
// TODO: Finish emailSent / forgotPassword state process
// import EmailSentModal from '../component/EmailSentModal';

// Styles
import {someStyles} from '../Styles';

//TODO: Timeout and retry signIn()
const Signin: React.FC = () => {
  console.log('-- Signin.tsx');

  let _emailInput;
  let _passwordInput;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  //FIXME: handle modal state using context
  const [modalState, setModalState] = useState(false);

  let {errors} = useUserState();

  useEffect(() => {
    const _handleContextErrors = () => {
      if (typeof errors === 'undefined' || errors === null) {
        console.log('errors is undefiend or null// there is no error');
        // return <></>;
      } else {
        console.log('errors is ' + errors);
        Alert.alert(
          'Ops...',
          'Encontramos um problema durante a autenticação.',
          // \nVerifique se digitou as credenciais corretamente e se possui conexão com a internet.
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                // errors = null;
                clearErrors(userDispatch);
              },
            },
          ],
          {cancelable: false},
        );
        // return <Text style={someStyles.textError}>{errors.message}</Text>;
      }
    };
    return _handleContextErrors();
  }, [errors]);

  //TODO: handle authentication errors from userContext
  // const [errors, setErrors] = useState(null);

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
                onSubmitEditing={() => {
                  _passwordInput.focus();
                }}
                blurOnSubmit={false}
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
                onSubmitEditing={handleSubmit}
              />

              {/* TODO: handleErrors from Context -> auth response */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}> */}
              {/* {_handleContextErrors()} */}
              <TouchableOpacity
                style={{justifyContent: 'flex-end', alignSelf: 'flex-end'}}
                onPress={() => {
                  setModalState(!modalState);
                }}>
                <Text style={someStyles.textLink}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
              {/* </View> */}

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
