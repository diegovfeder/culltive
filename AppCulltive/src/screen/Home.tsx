import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import FirstSigninModal from '../component/FirstSigninModal';

import {someStyles} from '../Styles';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [modalState, setModalState] = useState(false);

  // FIXME: Open FirstSigninModal if !paired
  // useEffect(() => {
  //   setTimeout(() => {
  //     setModalState(true);
  //   }, 2000);
  // }, [null]);

  const loadingContainer = (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 48,
        borderRadius: 300,
        width: 300,
        height: 300,
        backgroundColor: '#DDD',
      }}>
      <ActivityIndicator
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );

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
      {/*TODO: Ask if user already is set up with device pairing*/}
      {/*<FirstSigninModal modalState={modalState} />*/}

      {/*MAIN CIRCLE / LAZY LOADING*/}
      {loadingContainer}
      <View style={{width: '100%'}}>
        <TouchableOpacity
          style={someStyles.button}
          onPress={() => navigation.navigate('Report')}>
          <Text style={[someStyles.textButton]}>Relatórios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Home;
