import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

export const CustomButton: React.FC = (props) => {
  const {title = 'Enter', style = {}, textStyle = {}, onPress} = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 12,
    display: 'flex',
    height: 84,
    borderRadius: 84 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbc40',
    shadowOpacity: 5,
    shadowRadius: 20,
    elevation: 10,
    borderColor: '#707070',
    borderWidth: 0.5,
  },
  text: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
});
