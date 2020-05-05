// const useAsyncStorage = (key, defaultValue) => {
//   const [storageValue, updateStorageValue] = useState(defaultValue);
//   const [updated, setUpdated] = useState(false);
//
//   async function getStorageValue() {
//     let value = defaultValue;
//     try {
//       value = JSON.parse(await AsyncStorage.getItem(key)) || defaultValue;
//     } catch (e) {
//     } finally {
//       updateStorageValue(value);
//       setUpdated(true);
//     }
//   }
//
//   async function updateStorage(newValue) {
//     try {
//       if (newValue === null) {
//         await AsyncStorage.removeItem(key);
//       } else {
//         const value = JSON.stringify(newValue);
//         await AsyncStorage.setItem(key, value);
//       }
//     } catch (e) {
//     } finally {
//       setUpdated(false);
//       getStorageValue();
//     }
//   }
//
//   useEffect(() => {
//     getStorageValue();
//   }, [updated]);
//
//   return [storageValue, updateStorage];
// };
