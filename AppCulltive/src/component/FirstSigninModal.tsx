import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Components
import {Input} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Space from '../component/Space';
// import Modal from 'react-native-modal';

// Styles
import {someStyles} from '../Styles';
const {height, width} = Dimensions.get('window');

const FirstSigninModal: React.FC = (props) => {
  const navigation = useNavigation();
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
      <View style={styles.modal}>
        {closeIcon}
        <View>
          <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Oi!</Text>
          <Text style={[someStyles.h2, {alignSelf: 'flex-start'}]}>
            Você já possui um de nossos produtos?
          </Text>

          <Text style={[someStyles.h3, {alignSelf: 'flex-end'}]}>Não?</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text
              style={[
                someStyles.textLink,
                someStyles.h3,
                {alignSelf: 'flex-end', color: '#3cbc40'},
              ]}>
              Clique aqui para adquirir o seu!
            </Text>
          </TouchableOpacity>

          <Text style={[someStyles.h1, {alignSelf: 'flex-start'}]}>Sim!</Text>

          {/*<TouchableOpacity onPress={() => {}}>
                  <Text style={someStyles.textLink}>
                    Entre em contato com nosso suporte.
                  </Text>
                </TouchableOpacity>*/}

          {/*<Space margin={'32'} />*/}

          <TouchableOpacity
            style={[someStyles.button, {marginVertical: 16}]}
            onPress={() => {
              setModalState(!modalState);
              navigation.navigate('PairNavigator');
            }}>
            <Text style={someStyles.textButton}>Configurar dispositivo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: height,
    marginTop: 100,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#f9f9f9',
    borderRadius: 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 10,
    shadowRadius: 20,
    elevation: 10,
  },
});

export default FirstSigninModal;
