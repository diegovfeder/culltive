// import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {someColors} from './Colors';

// import {
//   material,
//   human,
//   iOSUIKit,
//   iOSColors,
//   systemWeights,
// } from 'react-native-typography';

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
    // marginVertical: 6,
    marginTop: 6,
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
  buttonSquared: {
    marginTop: 6,
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: someColors.secondary.color,
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
    borderColor: '#707070',
    borderWidth: 0.5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  carousel_container: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 12, //16
    marginVertical: 10, //12
  },
  container_header: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  container_spaced: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 10,
    justifyContent: 'space-between',
  },

  h0: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#959595',
    alignSelf: 'center',
    margin: 16,
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
  h1_number: {
    fontSize: 48,
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
  h3_bold: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
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
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  textButton: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  textError: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#E24F32',
    textDecorationLine: 'underline',
  },
  textGreen: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#3cbc40',
  },
  textLink: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: '#3cbc40',
    textDecorationLine: 'underline',
  },
  textShadow: {
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    shadowOpacity: 1,
    textShadowColor: someColors.light_gray.color,
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
  safeAreaContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  sensorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 4,
    // marginHorizontal: 16,
    padding: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 10,
    shadowRadius: 20,
    borderRadius: 16,
    elevation: 5,
  },
});

// Deleted / Removed / Trashed Styles

// reports.tsx / clima, sensores /
// style={[
//   someStyles.h1,
//   someStyles.textShadow,
//   someColors.tertiary,
//   {
//     alignSelf: 'flex-start',
//     margin: 0,
//     marginTop: 8,
//   },
// ]}
