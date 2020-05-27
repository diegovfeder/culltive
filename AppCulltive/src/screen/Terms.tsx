import React, {useEffect} from 'react';
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
        // Removed this view and inserted culltive, name on the navigation header.
        // Postponing work-- This needs to be a responsive grid / flex environment...
        // <View style={someStyles.headerView}>
        //   <Text style={someStyles.headerTitle}>culltive</Text>
        // </View>
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
      {/* <View style={{}}>
        <Text
          style={{
            color: '#6c6c6c',
            fontSize: 24,
            fontFamily: 'Montserrat-Bold',
            textAlign: 'center',
          }}>
          {Strings.termsHeader}
        </Text>
      </View> */}

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
