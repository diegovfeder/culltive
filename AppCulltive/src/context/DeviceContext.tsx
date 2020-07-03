import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import api from 'axios';

//TODO: useReducer with typescript but passing Types for initial values
var DeviceStateContext = createContext(undefined);

var DeviceDispatchContext = createContext(undefined);

function deviceReducer(state, action) {
  switch (action.type) {
    case 'LOADING_DEVICES':
      return {...state, loadingDevices: true};
    case 'GET_DEVICES':
      return {...state, devices: action.payload, loadingDevices: false};
    case 'GET_DEVICE':
      return {
        ...state,
        deviceData: action.payload,
      };
    case 'DELETE_DEVICE':
      return {
        ...state,
        paired: false,
        //TODO: remove pairedToken
      };
    case 'SET_DEVICE':
      return {
        ...state,
        name: action.payload.name,
      };
    case 'VALIDATE_TOKEN':
      return {
        ...state,
        paired: !!action.token,
      };
    case 'WATER_PUMP':
      return {
        ...state,
        waterpumpss: false,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DeviceProvider({children}) {
  const [state, dispatch] = useReducer(deviceReducer, {
    paired: false,
    name: '',
    device: {
      deviceId: 'CULLTIVE-CWB',
      geolocation: 'Curitiba',
      productType: 'BASIC',
      firmwareVersion: 'alpha',
      wifiPassword: 'TECHNO',
      wifiSSID: 'MELODICO',
      wifiStatus: 'connected',
    },
    waterPump: null,
  });

  return (
    <DeviceStateContext.Provider value={state}>
      <DeviceDispatchContext.Provider value={dispatch}>
        {children}
      </DeviceDispatchContext.Provider>
    </DeviceStateContext.Provider>
  );
}

function useDeviceState() {
  var context = useContext(DeviceStateContext);
  if (context === undefined) {
    throw new Error('useDeviceState must be used within a DeviceProvider');
  }
  return context;
}

function useDeviceDispatch() {
  var context = useContext(DeviceDispatchContext);
  if (context === undefined) {
    throw new Error('useDeviceDispatch must be used within a DeviceProvider');
  }
  return context;
}

export {
  DeviceProvider,
  useDeviceState,
  useDeviceDispatch,
  getDevices,
  getDevice,
  // postDevice,
  deleteDevice,
  validateDeviceToken,
  waterPump,
};
// ###########################################################

function getDevices(dispatch) {
  dispatch({type: 'LOADING_DEVICES'});
  api
    .get('/devices')
    .then((res) => {
      // console.log("devices: ", res);
      dispatch({type: 'GET_DEVICES', payload: res.data});
    })
    .catch((err) => {
      dispatch({type: 'GET_DEVICES', payload: []});
    });
}

// TODO: Finish this function -- get device by id
function getDevice(dispatch, deviceId) {
  // dispatch({ type: LOADING_Device });
  // .get(`/Device/${diegovfeder@gmail.com}`)
  api
    .get(`/device/${deviceId}`)
    .then((res) => {
      console.log('getDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_DEVICE',
        payload: res.data,
      });
    })
    .catch((err) => console.log('DeviceContext: getDevice: ERROR: ' + err));
}

// TODO: Finish this function -- delete device by id
function deleteDevice(dispatch, deviceId) {
  // dispatch({ type: LOADING_Device });
  console.log(`deviceId = ${deviceId}`);

  api
    .delete(`/device/${deviceId}`)
    .then((res) => {
      console.log('deleteDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'DELETE_DEVICE',
        payload: deviceId,
      });
    })
    .catch((err) => console.log('DeviceContext: deleteDevice: ERROR: ' + err));
}

function setDeviceName(dispatch, deviceId) {
  // dispatch({ type: LOADING_Device });
  console.log(`deviceId = ${deviceId}`);
  dispatch({type: 'SET_DEVICE', name: deviceId});
}

// const storeDeviceToken = async (value) => {
//   try {
//     console.log('storeDeviceToken: ' + value);
//     AsyncStorage.setItem('@deviceToken', value);
//   } catch (e) {
//     console.log(e.error);
//   }
// };

function validateDeviceToken(dispatch, deviceToken) {
  dispatch({type: 'VALIDATE_TOKEN', token: deviceToken});
}

function waterPump(dispatch, setLoading) {
  setLoading(true);
  setTimeout(() => {
    dispatch({type: 'WATER_PUMP'});
  }, 2000);
}

// TODO: Set device token when all the validation from esp8266 and firebase and user are ready!
// Reducer for Device Token
// case 'SET_DEVICE_TOKEN':
//   console.log('DeviceContext: deviceReducer: SET_DEVICE_TOKEN');
//   console.log('pairState: action.payload = ' + action.payload);
//   return {
//     ...state,
//     paired: action.payload,
//   };

// function validateDeviceToken(dispatch, deviceToken) {
//   dispatch({type: 'VALIDATE_DEVICE_TOKEN', token: deviceToken});
// }

// --   The following code was found social-ape study project // context // dispatch
// -- and meantdelete the state from a selected array of devices...
// let index = state.devices.findIndex(
//   (device) => device.deviceId === action.payload,
// );
// state.devices.splice(index, 1);

// --   The following code was an attempt to instantiate a DeviceContext with Typescript using, well Types...
// interface Device {
//   deviceId: string;
//   geolocation: string;
//   productType: string;
//   firmwareVersion: string;
//   wifiPassword: string;
//   wifiSSID: string;
//   wifiStatus: string;
// }
// const DeviceContext = createContext<Device>({
//   deviceId: 'CULLTIVE-000',
//   geolocation: 'Curitiba',
//   productType: 'BASIC',
//   firmwareVersion: 'alpha',
//   wifiPassword: 'TECHNO',
//   wifiSSID: 'MELODICO',
//   wifiStatus: 'connected',
// });
