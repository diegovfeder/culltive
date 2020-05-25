import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

import {Input} from 'react-native-elements';

// Hooks
import {useUserDispatch, signupUser} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

import {someStyles} from '../Styles';

// TODO: handleError (signup)
const Signup: React.FC = () => {
  console.log('-- Signup.tsx');

  let _namelInput;
  let _emailInput;
  let _passwordInput;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState(null); // connection Errors coming from userContext

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={someStyles.headerView}>
          <Text style={someStyles.headerTitle}>Criar nova conta</Text>
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
            // alert(JSON.stringify(values))
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
              />

              <TouchableOpacity
                onPress={handleSubmit}
                style={someStyles.button}>
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

export default Signup;
