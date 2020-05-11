import React, {useState, useEffect} from 'react';
import {
  Button,
  Dimensions,
  keyboardContainer,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
// TODO: postCredentials
import {useDataDispatch} from '../context/DataContext';
import {useNavigation} from '@react-navigation/native';

// Components
import InputTextField from '../component/InputTextField';
import {Input} from 'react-native-elements';

// Styles
import {someStyles} from '../Styles';

const WiFiCredentials: React.FC = () => {
  let _ssidInput;
  let _passwordInput;
  let dataDispatch = useDataDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <Formik
        initialValues={{ssid: '', password: ''}}
        validationSchema={Yup.object().shape({
          ssid: Yup.string().required('*Obrigatório'),
          password: Yup.string().required('*Obrigatório'),
        })}
        onSubmit={(values) => {
          // navigation.navigate('Confirmation')
          navigation.navigate('ConnectDevice');
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
              <Text style={someStyles.h1}>Conecte ao Wi-Fi</Text>
              <Text style={someStyles.h3}>
                Entre com as informações da rede Wi-Fi que será utilizada em seu
                dispositivo:
              </Text>

              <View style={{marginVertical: 16}}>
                <Input
                  ref={(component) => (_ssidInput = component)}
                  autoFocus
                  autoCapitalize="none"
                  placeholder="SSID"
                  value={values.ssid}
                  onChangeText={handleChange('ssid')}
                  onBlur={handleBlur('ssid')}
                  errorStyle={{color: 'red'}}
                  errorMessage={errors.ssid ? errors.ssid : ''}
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
              </View>
            </View>
            <TouchableOpacity
              style={[
                someStyles.button,
                {position: 'absolute', bottom: 0, width: '100%'},
              ]}
              onPress={handleSubmit}>
              <Text style={someStyles.textButton}>Continuar</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default WiFiCredentials;
