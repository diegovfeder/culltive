import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

import * as Svg from 'react-native-svg';

import {Divider} from 'react-native-elements';

import {useNavigation} from '@react-navigation/native';

import FirstSigninModal from '../component/FirstSigninModal';

// Styles
import {someStyles} from '../Styles';

// Assets
import PlantHomeUndraw from '../../assets/undraw/plantHome.svg';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

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
        borderRadius: 128,
        width: 128,
        height: 128,
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
        marginTop: 16,
        borderRadius: 256,
        width: 256,
        height: 256,
        backgroundColor: '#DDD',
      }}>
      <PlantHomeUndraw width={198} height={256} style={{alignSelf: 'center'}} />
      {/* <PlantHomeUndraw width={200} height={300} style={{alignSelf: 'center'}} /> */}
    </View>
  );

  const activityContainer = (
    <ScrollView style={{height: 96, marginStart: 8}}>
      {/* FIXME: turn into a list */}
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>
        O reservatório de água está ficando vazio
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebeádo luz suficiente
      </Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
      <Text style={someStyles.h3}>O reservatório de água está cheio</Text>
      <Text style={someStyles.h3}>
        O reservatório de água está ficando vazio
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebendo luz suficiente
      </Text>
      <Text style={someStyles.h3}>
        Sua planta não está recebendo luz suficiente
      </Text>
      <Text style={someStyles.h3}>O reservatório de água está vazio</Text>
    </ScrollView>
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 16,
        // marginVertical: 12,
        marginBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      {/*TODO: Ask if user already set up with device pairing*/}
      {/*<FirstSigninModal modalState={modalState} />*/}

      {/*MAIN CIRCLE / LAZY LOADING*/}
      {/* {loadingContainer} */}

      {plantContainer}

      <Divider style={{marginVertical: 8}} />

      <View style={{}}>
        <Text style={someStyles.h4}>ATIVIDADES RECENTES</Text>
        {activityContainer}
      </View>

      <Divider style={{marginVertical: 8}} />

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
