// https://www.gitmemory.com/issue/react-native-community/async-storage/32/512988815
import AsyncStorage from 'react-native';
import {useEffect, useState} from 'react';

const useAsyncStorage = <T,>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void, boolean] => {
  const [state, setState] = useState({
    hydrated: false,
    storageValue: defaultValue,
  });
  const {hydrated, storageValue} = state;

  async function pullFromStorage() {
    const fromStorage = await AsyncStorage.getItem(key);
    let value = defaultValue;
    if (fromStorage) {
      value = JSON.parse(fromStorage);
    }
    setState({hydrated: true, storageValue: value});
  }

  async function updateStorage(newValue: T) {
    setState({hydrated: true, storageValue: newValue});
    const stringifiedValue = JSON.stringify(newValue);
    await AsyncStorage.setItem(key, stringifiedValue);
  }

  useEffect(() => {
    pullFromStorage();
  }, []);

  return [storageValue, updateStorage, hydrated];
};

export default useAsyncStorage;
