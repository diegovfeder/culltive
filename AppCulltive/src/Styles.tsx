import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

import {
  material,
  human,
  iOSUIKit,
  iOSColors,
  systemWeights,
} from 'react-native-typography';

export const someStyles = StyleSheet.create({
  primary: {
    color: '#3ea341',
  },
  secondary: {
    color: '#3cbc40',
  },
  background: {
    backgroundColor: '#f6f7f8',
  },
  button: {
    marginVertical: 6,
    display: 'flex',
    height: 64,
    borderRadius: 64 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbc40',
    shadowOpacity: 5,
    shadowRadius: 20,
    elevation: 10,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  container: {
    marginHorizontal: 16,
  },
  h1: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#959595',
    alignSelf: 'center',
    margin: 8,
  },
  h2: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#959595',
  },
  h3: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#959595',
  },
  h4: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#959595',
    marginVertical: 2,
  },
  modalView: {
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  textButton: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  textLink: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#3cbc40',
    textDecorationLine: 'underline',
  },
  headerView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    color: '#FFF',
    fontWeight: '400',
    fontSize: 24,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat-Light',
    color: '#FFF',
    fontSize: 14,
  },
  headerButton: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
});
