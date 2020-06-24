import React from 'react';
import * as Svg from 'react-native-svg';
import MyLogo from '../../assets/cLogo.svg';

const Logo: React.FC = () => {
  return (
    <MyLogo
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

export default Logo;
