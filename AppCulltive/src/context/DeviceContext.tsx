import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import api from 'axios';

// interface Device {
//   deviceId: string;
//   geolocation: string;
//   productType: string;
//   firmwareVersion: string;
//   wifiPassword: string;
//   wifiSSID: string;
//   wifiStatus: string;
// }

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

// setAuthorizationHeader(res.data.token); // ???

// function validateDeviceToken(dispatch, deviceToken) {
//   dispatch({type: 'VALIDATE_DEVICE_TOKEN', token: deviceToken});
// }

// Not sure why is this for?...
// Probably to delete the state from a selected array of devices...
// let index = state.devices.findIndex(
//   (device) => device.deviceId === action.payload,
// );
// state.devices.splice(index, 1);

// const DeviceContext = createContext<Device>({
//   deviceId: 'CULLTIVE-000',
//   geolocation: 'Curitiba',
//   productType: 'BASIC',
//   firmwareVersion: 'alpha',
//   wifiPassword: 'TECHNO',
//   wifiSSID: 'MELODICO',
//   wifiStatus: 'connected',
// });

// case 'SET_DEVICE_TOKEN':
//   console.log('DeviceContext: deviceReducer: SET_DEVICE_TOKEN');
//   console.log('pairState: action.payload = ' + action.payload);
//   return {
//     ...state,
//     paired: action.payload,
//   };
