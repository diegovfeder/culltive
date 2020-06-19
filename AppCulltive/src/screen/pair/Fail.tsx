import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {StackActions, useNavigation} from '@react-navigation/native';

// TODO: Import Device Context // setDeviceToken

// Styles
import {someStyles} from '../../Styles';

// Assets
import FailUndraw from '../../../assets/undraw/failPairing.svg';

const Fail: React.FC = ({nav, route}) => {
  console.log('-- Fail.tsx');

  const navigation = useNavigation();

  const {error} = !route.params;
  console.log('Error: ' + error);

  const _handleSubtitle = () => {
    switch (error) {
      case 'Credentials': {
        return (
          <Text
            style={[
              someStyles.h3,
              {
                marginTop: 8,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}>
            Verifique se as credencias da sua rede Wi-Fi foram digitadas
            corretamente.
          </Text>
        );
      }
      case 'Connection': {
        return (
          <Text
            style={[
              someStyles.h3,
              {
                marginTop: 8,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}>
            Verifique se a sua rede Wi-Fi possui conexão estável com a internet.
          </Text>
        );
      }
      default: {
        return (
          <Text
            style={[
              someStyles.h3,
              {
                marginTop: 8,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}>
            Verifique se todos os passos foram seguidos e tente novamente.
          </Text>
        );
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text
          style={[
            someStyles.h2,
            {
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              textAlign: 'center',
            },
          ]}>
          Não foi possível completar o emparelhamento.
        </Text>
        {_handleSubtitle()}
      </View>

      <FailUndraw
        width={280}
        height={280}
        style={{alignSelf: 'center', marginVertical: 8}}
      />

      <TouchableOpacity
        onPress={() => {
          console.log('TODO: open Youtube link');
        }}>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            fontFamily: 'Montserrat-Bold',
            color: '#3cbc40',
            textDecorationLine: 'underline',
          }}>
          Clique aqui para assistir nosso tutorial de pareamento.
        </Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            //TODO: Open a help / FAQ / wpp linking to customer service
            console.log(
              'TODO: Open a help / FAQ / wpp linking to customer service',
            );
          }}
          style={{alignSelf: 'center'}}>
          <Text
            style={[
              someStyles.textButton,
              {color: '#3cbc40', paddingHorizontal: 8, alignSelf: 'center'},
            ]}>
            Ajuda?
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={[someStyles.button, {paddingHorizontal: 16}]}>
          <Text style={[someStyles.textButton]}>Tentar novamente</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export default Fail;
