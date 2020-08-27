import React, {useEffect} from 'react';
import {View} from 'react-native';

import {useFetch} from '../hooks/useFetch';

const ActComponent: React.FC = () => {
  console.log('-- ActComponent.tsx');

  // useEffect(() => {
  // const response = useFetch('/acts');
  // console.log('' + JSON.stringify(response));
  // }, []);

  return (
    <>
      <View></View>
    </>
  );
};

export default ActComponent;
