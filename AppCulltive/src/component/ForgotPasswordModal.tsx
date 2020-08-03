import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
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
  setIsReset,
} from '../context/FirebaseContext';

// Components
import {Input} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
// import Space from '../component/Space';

// Assets
import {someStyles} from '../Styles';
import {someColors} from '../Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EmailUndraw from '../../assets/undraw/mail.svg';
import * as Svg from 'react-native-svg';

const ForgotPasswordModal: React.FC = (props) => {
  console.log('-- ForgotPasswordModal.tsx');

  let _emailInput: any;

  //TODO: Validate setModalState !== null
  const modalState = props.modalState; // Receiving modalState and setModalState from parent

  const [loading, setLoading] = useState(false);

  const firebaseDispatch = useFirebaseDispatch();
  const {isReset, error} = useFirebaseState();

  const onCloseButton = () => {
    //TODO: Validate or test if setModalState !== null
    props.setModalState(false);
    if (isReset) setIsReset(firebaseDispatch, false);
  };

  const closeButton = (
    <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onCloseButton}>
      <Ionicons name="ios-close" size={42} color={someColors.black.color} />
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalState}
        onRequestClose={onCloseButton}>
        {isReset ? (
          <>
            <View style={[someStyles.modalView_big, {flex: 1}]}>
              {closeButton}
              <Text
                style={[
                  someStyles.h1,
                  someColors.tertiary,
                  {marginTop: 0, marginBottom: 12},
                ]}>
                Email enviado
              </Text>
              <Text style={someStyles.h3}>
                Verifique sua caixa de entrada e acesse o link para a
                redefinição de sua senha
              </Text>
              <EmailUndraw
                width={160}
                height={160}
                style={{margin: 16, alignSelf: 'center'}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <View>
                  <Text style={[someStyles.h3, {alignSelf: 'flex-start'}]}>
                    Não recebeu o email?
                  </Text>
                  <Text
                    style={[
                      someStyles.h3,
                      someColors.dark_gray,
                      {alignSelf: 'flex-start'},
                    ]}>
                    Verifique também o lixo eletrônico
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
            </View>
          </>
        ) : (
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
                  {closeButton}
                  <Text
                    style={[
                      someStyles.h1,
                      someColors.tertiary,
                      {marginTop: 0, marginBottom: 12},
                    ]}>
                    Recupere sua senha
                  </Text>
                  <Text style={[someStyles.h3, someColors.dark_gray]}>
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
                          console.log(
                            'TODO: Open whatsapp link with a message',
                          );
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
        )}
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
