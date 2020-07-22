import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// Contexts
import {
  useFirebaseDispatch,
  useFirebaseState,
  resetPassword,
} from '../context/FirebaseContext';

// Components
import {Input} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Space from '../component/Space';

// Assets
import {someStyles} from '../Styles';
import {someColors} from '../Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPasswordModal: React.FC = (props) => {
  console.log('-- ForgotPasswordModal.tsx');

  let _emailInput: any;
  const modalState = props.modalState; // Receiving modalState and setModalState from parent

  const [loading, setLoading] = useState(false);

  const firebaseDispatch = useFirebaseDispatch();
  const {isReset, error} = useFirebaseState();

  const closeIcon = (
    <TouchableOpacity
      style={{alignSelf: 'flex-end'}}
      onPress={() => {
        //TODO: Validate or test if setModalState !== null
        props.setModalState(false);
        console.log('close pressed');
      }}>
      <Ionicons name="ios-close" size={42} color={someColors.black.color} />
    </TouchableOpacity>
  );

  useEffect(() => {
    console.log('isReset is: ' + isReset);
    if (isReset) {
      // email successfully sent
      //TODO:show message to user and close modal
      props.setModalState(false);
    } else {
      //...
    }
  }, [isReset]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalState}
        onRequestClose={() => {
          //TODO: Validate or test if setModalState !== null
          props.setModalState(false);
        }}>
        <Formik
          initialValues={{email: ''}}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Email inválido')
              .required('*Obrigatório'),
          })}
          onSubmit={(values) => {
            console.log('values: ' + JSON.stringify(values));
            resetPassword(firebaseDispatch, values.email, setLoading);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={[someStyles.modalView_big, {flex: 1}]}>
              <KeyboardAvoidingView
                behavior={'padding'}
                style={someStyles.keyboardContainer}>
                {closeIcon}
                <Text
                  style={[
                    someStyles.h1,
                    someColors.tertiary,
                    {marginTop: 0, marginBottom: 12},
                  ]}>
                  Recupere sua senha
                </Text>
                <Text style={someStyles.h3}>
                  Enviaremos um link para redefinição de sua senha.
                </Text>

                <Input
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

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <View>
                    <Text style={[someStyles.h3, {alignSelf: 'flex-end'}]}>
                      Não lembra seu email?
                    </Text>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'flex-start',
                      }}
                      onPress={() => {
                        console.log('TODO: Open whatsapp link with a message');
                      }}>
                      <Text
                        style={[
                          someStyles.textLink,
                          {fontSize: 14, marginBottom: 8},
                        ]}>
                        Entre em contato com nosso suporte.
                      </Text>
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
                    <Text style={[someStyles.textButton]}>Enviar</Text>
                  )}
                </TouchableHighlight>
              </KeyboardAvoidingView>
            </View>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
