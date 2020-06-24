import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableHighlight, View} from 'react-native';

// import {CulltiveButton} from '../component/CulltiveButton';
import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

import {Strings} from '../Strings';

import {someStyles} from '../Styles';

import WelcomeUndraw from '../../assets/undraw/welcome.svg';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={{justifyContent: 'flex-start'}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Montserrat-Bold',
              justifyContent: 'flex-start',
              textAlign: 'center',
              paddingVertical: 8,
              paddingEnd: 32,
            }}>
            {Strings.termsHeader}
          </Text>
        </View>
      ),
    });
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      <ScrollView style={{marginBottom: 32}}>
        <Text
          style={{
            marginHorizontal: 16,
            color: '#959595',
            fontSize: 16,
            fontFamily: 'Montserrat-Regular',
          }}>
          {Strings.termsBody}
        </Text>
      </ScrollView>

      <View style={{bottom: 0, position: 'absolute', width: '100%'}}>
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          style={[someStyles.button, {marginHorizontal: 16}]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={someStyles.text}>OK</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Welcome;
