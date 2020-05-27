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
    height: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbc40',
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  buttonWhite: {
    marginVertical: 6,
    display: 'flex',
    height: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  h1: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#959595',
    alignSelf: 'center',
    margin: 8,
  },
  h1_regular: {
    fontSize: 24,
    fontFamily: 'Montserrat-Regular',
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
  keyboardContainer: {
    flex: 1,
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
    paddingVertical: 4,
    marginVertical: 4,
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
    margin: 16,
  },
});
