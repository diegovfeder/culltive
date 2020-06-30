import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Svg from 'react-native-svg';

import {useNavigation} from '@react-navigation/native';

// Styles
import {someStyles} from '../../Styles';

// Assets
import ConfirmationUndraw from '../../assets/undraw/confirmation.svg';

const Confirmation: React.FC = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={[someStyles.h1]}>Estabelecendo vínculo</Text>
      </View>
      <ActivityIndicator />
    </SafeAreaView>
  );
};

export default Confirmation;
