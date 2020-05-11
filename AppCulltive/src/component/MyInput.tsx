import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import * as Icon from 'react-native-vector-icons';

import Text from './Text';
import Block from './Block';
// import Button from "./Button";
import {theme} from '../constant';

const MyInput: React.FC = (props) => {
  const [secureTextState, setSecureTextState] = useState(false);
  const [eyeState, setEyeState] = useState(true);

  const [secure, toggleSecure] = useState(true);

  const {email, phone, number, secure, error, style, ...props} = props;

  function renderLabel() {
    const {label, error} = props;
    return (
      <Block flex={false}>
        {label ? (
          <Text gray2={!error} accent={error}>
            {label}
          </Text>
        ) : null}
      </Block>
    );
  }

  function renderToggle() {
    const {secure, rightLabel} = this.props;
    const {toggleSecure} = this.state;

    if (!secure) {
      return null;
    }

    return (
      <Button
        style={styles.toggle}
        onPress={() => this.setState({toggleSecure: !toggleSecure})}>
        {rightLabel ? (
          rightLabel
        ) : (
          <Icon.Ionicons
            color={theme.colors.gray}
            size={theme.sizes.font * 1.35}
            name={!toggleSecure ? 'md-eye' : 'md-eye-off'}
          />
        )}
      </Button>
    );
  }

  function renderRight() {
    const {rightLabel, rightStyle, onRightPress} = this.props;

    if (!rightLabel) {
      return null;
    }

    return (
      <Button
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}>
        {rightLabel}
      </Button>
    );
  }

  return (
    <Block flex={false} margin={[theme.sizes.base, 0]}>
      {this.renderLabel()}
      <TextInput
        style={inputStyles}
        secureTextEntry={isSecure}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={inputType}
        {...props}
      />
      {this.renderToggle()}
      {this.renderRight()}
    </Block>
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

export default MyInput;

// return (
//   <Input
//     {...props}
//     maxLength={40}
//     style={styles.input}
//     secureTextEntry={!!(props.secureTextEntry ^ secureTextState)}
//   />
// );

// const { toggleSecure } = this.state;
//     const isSecure = toggleSecure ? false : secure;
//
//     const inputStyles = [
//       styles.input,
//       error && { borderColor: theme.colors.accent },
//       style
//     ];
//
//     const inputType = email
//       ? "email-address"
//       : number
//       ? "numeric"
//       : phone
//       ? "phone-pad"
//       : "default";
