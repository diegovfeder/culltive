import React, {useState, useEffect} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';
import * as Svg from 'react-native-svg';

// Components
import Ionicons from 'react-native-vector-icons/Ionicons';

// Assets
import EmailUndraw from '../../assets/undraw/mail.svg';

// Styles
import {someStyles} from '../Styles';

const EmailSentModal: React.FC = (props) => {
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
        console.log('TODO: handlCloseModal');
      }}>
      <View style={someStyles.modalView}>
        {closeIcon}
        <View>
          <Text style={someStyles.h1}>Email enviado.</Text>

          <Text style={someStyles.h3}>
            Verifique sua caixa de entrada e acesse o link de redefinição de
            senha.
          </Text>

          <EmailUndraw
            width={160}
            height={160}
            style={{margin: 16, alignSelf: 'center'}}
          />

          <Formik
            initialValues={{email: ''}}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Email inválido')
                .required('*Obrigatório'),
            })}
            onSubmit={(values) =>
              console.log('TODO: firebaseForgotPassword - email form')
            }>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={someStyles.h4}>Não recebeu o email?</Text>
                <Text style={[someStyles.h4, {color: '#6C6C6C'}]}>
                  Verifique também o lixo eletrônico
                </Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={someStyles.textLink}>
                    Entre em contato com nosso suporte.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

export default EmailSentModal;
