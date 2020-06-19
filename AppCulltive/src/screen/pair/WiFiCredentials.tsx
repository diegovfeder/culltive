import React, {useState, useEffect} from 'react';
import {
  AsyncStorage,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {useDataDispatch} from '../../context/DataContext';
import {useUserState} from '../../context/UserContext';
import {useNavigation} from '@react-navigation/native';

// Components
import InputTextField from '../../component/InputTextField';
import {Input} from 'react-native-elements';

// Styles
import {someStyles} from '../../Styles';

const WiFiCredentials: React.FC = () => {
  console.log('-- WiFiCredentials.tsx');

  let _ssidInput;
  let _passwordInput;
  let dataDispatch = useDataDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  let {user} = useUserState();
  console.log('user = ' + user);

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
          // const props = JSON.stringify({...values, })
          // TODO: if all wi-fi data is validated (ssid and password verifies)
          // save data to asyncStorage,
          // _storeData(values);
          // navigate to select device / device finder / connect to soft ap Wi-Fi
          console.log('values: ' + JSON.stringify(values));
          navigation.navigate('ConnectionHandshake', values);
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
                {' '}
                Digite as informações da sua rede Wi-Fi.
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
                  onSubmitEditing={handleSubmit}
                  // secureTextEntry={true}
                />
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
              <Text style={someStyles.textButton}>Continuar</Text>
            </TouchableHighlight>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default WiFiCredentials;
