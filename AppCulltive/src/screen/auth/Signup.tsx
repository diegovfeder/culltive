import React, {useState, useEffect} from 'react';
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

// Navigation
import {useNavigation} from '@react-navigation/native';

// Contexts
import {
  useUserDispatch,
  useUserState,
  signupUser,
  clearError,
} from '../../context/UserContext';

// Components
import {Input} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';

// Assets
import {someStyles} from '../../Styles';
import {someColors} from '../../Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Signup: React.FC = () => {
  console.log('-- Signup.tsx');

  let _namelInput: any;
  let _emailInput: any;
  let _passwordInput: any;
  const userDispatch = useUserDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [secureTextState, setSecureTextState] = useState(true);

  // TODO: handleError useUserCntext
  let {error} = useUserState();

  //TODO: Transform error responses into text
  // Network Error -> Verifique sua conexao com a internet
  // Request failed with status code 401 -> Verifique se suas credenciais foram digitadas corretamente
  useEffect(() => {
    let mounted = true;

    const _handleContextErrors = () => {
      if (mounted) {
        if (typeof error === 'undefined' || error === null) {
          //...
        } else {
          console.log('signup() : ' + error);
          Alert.alert(
            'Ops...',
            'Encontramos um problema durante a autenticação.' + '\n\n' + error,
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  // errors = null;
                  clearError(userDispatch);
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    };

    _handleContextErrors();

    return function cleanup() {
      mounted = false;
    };
  }, [error]);

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
    <SafeAreaView style={someStyles.container_spaced}>
      <Formik
        initialValues={{name: '', email: '', password: ''}}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(2, 'Nome curto demais')
            .max(50, 'Nome longo demais')
            .required('*Obrigatório'),
          email: Yup.string().email('Email inválido').required('*Obrigatório'),
          password: Yup.string().required('*Obrigatório'),
        })}
        onSubmit={(values) => {
          //TODO: One input at a time form validation.
          // - for each onSubmit(validate value and position onto the next input until all are valid)
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
          <KeyboardAvoidingView
            behavior={'padding'}
            style={someStyles.keyboardContainer}>
            <View
              style={{
                flex: 1,
              }}>
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
              {/* Input with secureTextState eye icon */}
              <View>
                <Input
                  ref={(component) => (_passwordInput = component)}
                  placeholder="Senha"
                  secureTextEntry={secureTextState}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  errorStyle={{color: 'red'}}
                  errorMessage={
                    errors.password && touched.password ? errors.password : ''
                  }
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  style={{left: '90%', top: '20%', position: 'absolute'}}
                  onPress={() => {
                    setSecureTextState(!secureTextState);
                  }}>
                  <Ionicons
                    name={secureTextState ? 'ios-eye' : 'ios-eye-off'}
                    size={24}
                    color={someColors.tertiary.color}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableHighlight
              underlayColor="#3ea341"
              activeOpacity={1}
              style={[
                someStyles.button,
                {position: 'absolute', bottom: 0, width: '100%'},
              ]}
              onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <Text style={[someStyles.textButton]}>Continuar</Text>
              )}
            </TouchableHighlight>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Signup;
