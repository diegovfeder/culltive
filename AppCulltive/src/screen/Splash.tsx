import React, {useEffect} from 'react';
import {AsyncStorage, Dimensions, SafeAreaView, Text, View} from 'react-native';

// TODO: validate logo dimensions in different screens
import Logo from '../component/Logo';

// TODO: lazyload / fetch important data from firebase and save to context

const Splash: React.FC = () => {
  console.log('-- Splash.tsx');

  //TODO: Animate something hereusing React Animated :)
  //-- do coooool stuff!
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#3ea341',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Logo />
    </SafeAreaView>
  );
};

export default Splash;
