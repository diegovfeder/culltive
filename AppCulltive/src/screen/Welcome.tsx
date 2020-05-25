import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../Styles';

// Assets
import WelcomeUndraw from '../../assets/undraw/welcome.svg';

const Welcome: React.FC = () => {
  console.log('-- Welcome.tsx');

  const navigation = useNavigation();

  return (
    <SafeAreaView
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

      <WelcomeUndraw width={320} height={320} style={{alignSelf: 'center'}} />

      <View style={{width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signup');
          }}
          style={someStyles.button}>
          <Text style={[styles.text]}>Criar nova conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signin');
          }}
          style={someStyles.buttonWhite}>
          <Text style={[styles.textGreen]}>Já possuo cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Terms');
          }}>
          <Text style={[someStyles.textLink, {alignSelf: 'center'}]}>
            Termos e Condições de uso da Plataforma
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  textGreen: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#3cbc40',
  },
});

export default Welcome;
