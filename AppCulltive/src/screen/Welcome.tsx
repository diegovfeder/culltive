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
import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';
import {useAsyncStorage} from '../util/useAsyncStorage';
// TODO: Finish this useAsyncStorage thing...
// const [qrCode, setQrCode] = useAsyncStorage("qrCode", "CB-XXXX");

import {someStyles} from '../Styles';

import WelcomeUndraw from '../../assets/undraw/welcome.svg';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      <View style={{}}>
        <Text
          style={{
            color: '#3ea341',
            fontSize: 36,
            fontFamily: 'Montserrat-Bold',
          }}>
          culltive,
        </Text>
        <Text
          style={{
            color: '#3cbc40',
            fontSize: 24,
            fontFamily: 'Montserrat-Bold',
          }}>
          a natureza perto de você!
        </Text>
      </View>

      <WelcomeUndraw width={240} height={240} style={{alignSelf: 'center'}} />

      <View style={{width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signup');
          }}
          style={styles.button}>
          <Text style={[styles.text]}>Criar nova conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signin');
          }}
          style={styles.buttonWhite}>
          <Text style={[styles.textGreen]}>Já possuo cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Terms');
          }}>
          <Text style={styles.textLink}>
            Termos e Condições de uso da Plataforma
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 6,
    display: 'flex',
    height: 84,
    borderRadius: 84 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbc40',
    shadowOpacity: 5,
    shadowRadius: 20,
    elevation: 10,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  buttonWhite: {
    marginVertical: 6,
    display: 'flex',
    height: 84,
    borderRadius: 84 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 5,
    shadowRadius: 20,
    elevation: 10,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  textGreen: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#3cbc40',
  },
  textLink: {
    marginVertical: 8,
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#3cbc40',
    textDecorationLine: 'underline',
  },
});

export default Welcome;
