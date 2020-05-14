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
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
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

  const _storeData = async (values) => {
    try {
      console.log('_storeData: ' + values.ssid + ' - ' + values.password);
      const items = [
        ['@ssid', values.ssid],
        ['@password', values.password],
        ['@user', 'getUserFromContext'], //// FIXME: change to useDataContext -> getUserData
      ];
      // JSON Object multiSet
      AsyncStorage.setItem('@WIFI', JSON.stringify(items));
      // std multiSet from lib
      AsyncStorage.multiSet(items, () => {
        //to do something
      });
    } catch (e) {
      console.log(e.error);
    }
  };

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
          // TODO: if all wi-fi data is validated (ssid and password verifies)
          // save data to asyncStorage,
          _storeData(values);
          // navigate to select device / device finder / connect to soft ap Wi-Fi
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

// const storeWiFiCredentials = async () => {
//   try {
//     await AsyncStorage.multiSet([['TECHNO', 'MELODICO'], ['k2', 'val2']], cb);
//     ('@DeviceToken', 'culltiveXXX');
//   } catch (e) {
//     console.log(e.error);
//   }
// };

// async function storeWiFiCredentials(values) {
//   try {
//     console.log('WiFiCredentials: ' + values);
//     await AsyncStorage.multiSet([
//       ['@ssid', values.ssid],
//       ['@password', values.password],
//     ]);
//   } catch (e) {
//     console.log(e.error);
//   }
// }
