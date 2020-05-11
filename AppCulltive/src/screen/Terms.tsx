import React from 'react';
import {
  View,
  ScrollView,
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

import {Strings} from '../Strings';

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
          {Strings.termsHeader}
        </Text>
      </View>

      <ScrollView style={{marginVertical: 12}}>
        <Text
          style={{
            color: '#959595',
            fontSize: 16,
            fontFamily: 'Montserrat-Regular',
          }}>
          {Strings.termsBody}
        </Text>
      </ScrollView>

      <View style={{bottom: 0, position: 'absolute', width: '100%'}}>
        <TouchableOpacity
          style={someStyles.button}
          onPress={() => {
            navigation.navigate('Welcome');
          }}>
          <Text style={[styles.text]}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
