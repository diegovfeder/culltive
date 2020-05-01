import React from 'react';
import {
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// import {CulltiveButton} from '../component/CulltiveButton';

import {useAsyncStorage} from '../util/useAsyncStorage';
// TODO: Finish this useAsyncStorage thing...
// const [qrCode, setQrCode] = useAsyncStorage("qrCode", "CB-XXXX");

import {someStyles} from '../Styles';

const Signin: React.FC = () => (
  <View style={{marginHorizontal: 16}}>
    <TouchableOpacity>
      <Text style={styles.textLink}>Esqueceu sua senha?</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => {}} style={styles.button}>
      <Text style={[styles.text]}>Entrar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 12,
    display: 'flex',
    height: 84,
    borderRadius: 84 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbc40',
    shadowOpacity: 5,
    shadowRadius: 20,
    shadowOffset: {height: 5, width: 0},
  },
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  textLink: {
    marginVertical: 12,
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#3cbc40',
    textDecorationLine: 'underline',
  },
});

export default Signin;
