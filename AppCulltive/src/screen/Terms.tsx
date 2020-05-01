import React from 'react';
import {
  View,
  Text,
  TextInput,
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
            color: '#6c6c6c',
            fontSize: 20,
            fontFamily: 'Montserrat-Bold',
            textAlign: 'center',
          }}>
          Termos e Condições de uso da Plataforma
        </Text>
      </View>

      <View style={{justifyContent: 'center'}}>
        <Text
          style={{
            color: '#959595',
            fontSize: 16,
            fontFamily: 'Montserrat-Regular',
          }}>
          A Culltive Soluções, escrita no CNPJ 35.151.676/0001-60, com sede em
          Curitiba – PR, única e exclusiva proprietária dos domínios que
          utilizam a plataforma Aplicativos para celular,
          como: [https://aplicativosparacelular.net](https://aplicativosparacelular.net/),
          https://mobileb.app/ e doravante denominada unicamente de *APLICATIVOS
          PARA CELULAR .NET, estabelece o presente instrumento,
          denominado **TERMOS DE USO* que permite aos usuários possuidores
          de *CONTA* na plataforma (*APPERS) criarem aplicativos para celulares
          e tablets (APPS) das plataformas Android, iOS, HTML5 para o uso de
          outros Usuários (USUÁRIOS FINAIS) através de seus **SERVIÇOS*. Por
          este *TERMO DE USO, o **APPER* da *APLICATIVOS PARA CELULAR* fica
          ciente e concorda que ao utilizar a plataforma da *APLICATIVOS PARA
          CELULAR* para construir, desenvolver e publicar seu *APP, em qualquer
          plataforma de celular ou qualquer loja de aplicativos, automaticamente
          aderirá e concordará em se submeter integralmente às condições do
          presente **TERMO DE USO* e qualquer de suas alterações futuras.
        </Text>
      </View>

      <View style={{bottom: 0, position: 'absolute', width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Welcome');
          }}
          style={styles.button}>
          <Text style={[styles.text]}>OK</Text>
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
