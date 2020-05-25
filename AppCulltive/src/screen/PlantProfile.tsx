import React, {useState, useEffect} from 'react';
import {
  AsyncStorage,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Hooks
import {useDataDispatch} from '../context/DataContext';
import {useDeviceDispatch, setPaired} from '../context/DeviceContext';
import {useNavigation} from '@react-navigation/native';

// Components
import {Input} from 'react-native-elements';

// Styles
import {someStyles} from '../Styles';

// Assets
import PlantHandUndraw from '../../assets/undraw/plantHand.svg';

const PlantProfile: React.FC = () => {
  console.log('-- PlantProfile.tsx');

  let _plantNameInput;
  let dataDispatch = useDataDispatch();
  let deviceDispatch = useDeviceDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // TODO: Function post / create plant profile @ firestore / async
  const _storePaired = async (value) => {
    try {
      console.log('_storePaired: ' + value);
      // JSON Object multiSet
      AsyncStorage.setItem('@PAIR', value);
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
        initialValues={{plantName: ''}}
        validationSchema={Yup.object().shape({
          plantName: Yup.string().required('*Obrigatório'),
        })}
        onSubmit={(values) => {
          _storePaired(true);
          setPaired(deviceDispatch);
          // setPaired == true // serPlantName...
          // navigation.navigate('ConnectDevice');
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
              <Text style={someStyles.h1}>
                Vamos criar um perfil para sua plantinha?
              </Text>
              <View style={{marginVertical: 16}}>
                <Input
                  ref={(component) => (_plantNameInput = component)}
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Qual será o nome dela?"
                  value={values.plantName}
                  onChangeText={handleChange('plantName')}
                  onBlur={handleBlur('plantName')}
                  errorStyle={{color: 'red'}}
                  errorMessage={errors.plantName ? errors.plantName : ''}
                />
              </View>
              <PlantHandUndraw
                width={320}
                height={320}
                style={{alignSelf: 'center'}}
              />
            </View>

            <TouchableOpacity
              style={[
                someStyles.button,
                {position: 'absolute', bottom: 0, width: '100%'},
              ]}
              onPress={handleSubmit}>
              <Text style={someStyles.textButton}>Confirmar</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default PlantProfile;
