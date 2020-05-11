import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Ionicons} from 'react-native-vector-icons';

const InputTextField: React.FC = (props) => {
  const [secureTextState, setSecureTextState] = useState(false);
  const [eyeState, setEyeState] = useState(true);

  return (
    <View style={props.style}>
      <Text style={styles.inputTitle}>{props.title}</Text>

      <TextInput
        {...props}
        maxLength={40}
        style={styles.input}
        secureTextEntry={!!(props.secureTextEntry ^ secureTextState)}
      />

      <View style={{borderBottomWidth: 1, borderBottomColor: '#D8D8D8'}} />
      {props.secureTextEntry ? (
        <TouchableOpacity
          style={{left: '90%', top: '50%', position: 'absolute'}}
          onPress={() => {
            setSecureTextState(!secureTextState);
            setEyeState(!eyeState);
          }}>
          <Ionicons
            name={eyeState ? 'ios-eye' : 'ios-eye-off'}
            size={24}
            color="#444"
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    color: '#111',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    paddingVertical: 12,
    color: 'gray',
    fontSize: 18,
    fontFamily: 'Avenir Next',
  },
});

export default InputTextField;
