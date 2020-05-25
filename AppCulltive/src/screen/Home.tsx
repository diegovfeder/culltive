import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

import FirstSigninModal from '../component/FirstSigninModal';

// Styles
import {someStyles} from '../Styles';

// Assets
import PlantHomeUndraw from '../../assets/undraw/plantHome.svg';

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
        color={'#3cbc40'}
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );

  const plantContainer = (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 48,
        borderRadius: 300,
        width: 300,
        height: 300,
        backgroundColor: '#DDD',
      }}>
      <PlantHomeUndraw width={220} height={300} style={{alignSelf: 'center'}} />
    </View>
  );

  const activityContainer = <View></View>;

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
      {/*TODO: Ask if user already set up with device pairing*/}
      {/*<FirstSigninModal modalState={modalState} />*/}

      {/*MAIN CIRCLE / LAZY LOADING*/}
      {/* {loadingContainer} */}
      {plantContainer}

      <View style={{width: '100%'}}>
        <Text style={someStyles.h4}>ATIVIDADES RECENTES</Text>
        {activityContainer}
      </View>
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
