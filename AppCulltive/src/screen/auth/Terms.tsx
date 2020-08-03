import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableHighlight, View} from 'react-native';

// Navigation
import {useNavigation} from '@react-navigation/native';

// Assets
import {someStyles} from '../../Styles';
import {Strings} from '../../Strings';
// import * as Svg from 'react-native-svg';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  // Sets Mavigation Header View
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
      ),
    });
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      <ScrollView fadingEdgeLength={16} style={{marginBottom: 0}}>
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

      <View
        style={{
          bottom: 0,
          marginBottom: 12,
          position: 'absolute',
          width: '100%',
        }}>
        <TouchableHighlight
          underlayColor="#3ea341"
          activeOpacity={1}
          style={[someStyles.button, {marginHorizontal: 12}]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={someStyles.text}>OK</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Welcome;
