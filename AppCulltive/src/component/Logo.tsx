import React from 'react';
import * as Svg from 'react-native-svg';
import MyLogo from '../../assets/cLogo.svg';

const Logo: React.FC = (props: any) => {
  return (
    <MyLogo
      width={props?.width}
      height={props?.height}
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

export default Logo;
