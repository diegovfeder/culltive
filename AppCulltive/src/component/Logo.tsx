import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const Logo: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
        margin: 64,
        shadowOffset: 5,
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation: 10,
        borderColor: '#000',
        borderWidth: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius:
          Math.round(
            Dimensions.get('window').width + Dimensions.get('window').height,
          ) / 2,
      }}>
      <Text
        style={{
          fontSize: Dimensions.get('window').width * 0.6,
          fontFamily: 'Montserrat-Bold',
          color: '#3ea341',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          marginRight: 16,
        }}>
        C
      </Text>
    </View>
  );
};

export default Logo;
