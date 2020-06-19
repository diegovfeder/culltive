import React, {useState, useEffect} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
} from 'react-native';

import {Input} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {
  useUserDispatch,
  useUserState,
  signupUser,
  clearErrors,
} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

const Signup: React.FC = () => {
  console.log('-- Signup.tsx');

  let _namelInput;
  let _emailInput;
  let _passwordInput;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // TODO: handleError useUserCntext
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

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Criar nova conta</Text>
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
          initialValues={{name: '', email: '', password: ''}}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(2, 'Nome curto demais')
              .max(50, 'Nome longo demais')
              .required('*Obrigatório'),
            email: Yup.string()
              .email('Email inválido')
              .required('*Obrigatório'),
            password: Yup.string().required('*Obrigatório'),
          })}
          onSubmit={(values) => {
            console.log(JSON.stringify(values));
            signupUser(
              userDispatch,
              values.name,
              values.email,
              values.password,
              setLoading,
            );
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
                ref={(component) => (_namelInput = component)}
                autoFocus
                placeholder="Nome"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                errorStyle={{color: 'red'}}
                errorMessage={errors.name ? errors.name : ''}
                onSubmitEditing={() => {
                  _emailInput.focus();
                }}
                blurOnSubmit={false}
              />
              <Input
                ref={(component) => (_emailInput = component)}
                autoCapitalize="none"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                errorStyle={{color: 'red'}}
                errorMessage={errors.email && touched.email ? errors.email : ''}
                onSubmitEditing={() => {
                  _passwordInput.focus();
                }}
                blurOnSubmit={false}
              />
              <Input
                ref={(component) => (_passwordInput = component)}
                placeholder="Senha"
                secureTextEntry={true}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorStyle={{color: 'red'}}
                errorMessage={
                  errors.password && touched.password ? errors.password : ''
                }
                onSubmitEditing={handleSubmit}
              />
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

export default Signup;
