import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Components
import {Input} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Space from '../component/Space';

// Styles
import {someStyles} from '../Styles';

const ForgotPasswordModal: React.FC = (props) => {
  const [modalState, setModalState] = useState(props.modalState);

  const closeIcon = (
    <TouchableOpacity
      style={{alignSelf: 'flex-end'}}
      onPress={() => {
        setModalState(!modalState);
      }}>
      <Ionicons name="ios-close" size={30} color="#959595" />
    </TouchableOpacity>
  );

  useEffect(() => {
    setModalState(props.modalState);
  }, [props]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalState}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={someStyles.modalView}>
        {closeIcon}
        <View>
          <Text style={someStyles.h3}>
            Enviaremos um link para redefinição de sua senha.
          </Text>

          <Formik
            initialValues={{email: ''}}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Email inválido')
                .required('*Obrigatório'),
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
                  style={someStyles.h1}
                  ref={(component) => (_emailInput = component)}
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  errorStyle={{color: 'red'}}
                  errorMessage={
                    errors.email && touched.email ? errors.email : ''
                  }
                />

                <Text style={someStyles.h3}>Não lembra seu email?</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={someStyles.textLink}>
                    Entre em contato com nosso suporte.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/*<Space margin={'32'} />*/}

          <TouchableOpacity
            style={[someStyles.button, {marginVertical: 16}]}
            onPress={() => {
              setModalState(!modalState);
            }}>
            <Text style={someStyles.textButton}>Recuperar senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginVertical: 100,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#f9f9f9',
    paddingVertical: 20,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.65,
    elevation: 4,
  },
});

export default ForgotPasswordModal;
