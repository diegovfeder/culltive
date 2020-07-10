import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import WelcomeUndraw from '../../../assets/undraw/welcome.svg';

//TODO: Layout should be responsive or at least tested in small / medium / large screens
const Welcome: React.FC = () => {
  console.log('-- Welcome.tsx');

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <Text
          style={{
            color: '#3ea341',
            fontSize: 36,
            fontFamily: 'Montserrat-Bold',
          }}>
          culltive
        </Text>
      ),
    });
  });

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
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Signup');
          }}
          style={someStyles.button}>
          <Text style={someStyles.text}>Criar nova conta</Text>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="#f7f8f9ee"
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Signin');
          }}
          style={someStyles.buttonWhite}>
          <Text style={someStyles.textGreen}>Já possuo cadastro</Text>
        </TouchableHighlight>

        <TouchableOpacity
          activeOpacity={0.5}
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

export default Welcome;
