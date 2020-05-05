import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

import {Input} from 'react-native-elements';

// Hooks
import {useFirebaseDispatch, resetPassword} from '../context/FirebaseContext';
import {useUserDispatch, loginUser, signupUser} from '../context/UserContext';
import {useNavigation} from '@react-navigation/native';

import {someStyles} from '../Styles';

const Signup: React.FC = () => {
  const navigation = useNavigation();
  // const [errors, setErrors] = useState(null);

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
            name: Yup.string()
              .min(2, 'Nome curto demais')
              .max(50, 'Nome longo demais')
              .required('*Obrigatório'),
            email: Yup.string()
              .email('Email inválido')
              .required('*Obrigatório'),
            password: Yup.string().required('*Obrigatório'),
          })}
          onSubmit={(values) => alert(JSON.stringify(values))}>
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
                errorMessage={errors.name && touched.name ? errors.name : ''}
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
                errorStyle={{color: 'red'}}
                errorMessage={errors ? 'Error' : ''}
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
                <Text style={[styles.text]}>Continuar</Text>
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
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  textLink: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#3cbc40',
    textDecorationLine: 'underline',
  },
});

export default Signup;
