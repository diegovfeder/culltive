import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';

import api from '../util/api';

interface IDevice {
  deviceId: string;
  geolocation: string;
  productType: string;
  firmwareVersion: string;
  action: {
    ledTape: boolean;
    waterPump: boolean;
  };
}

var DeviceStateContext = createContext(undefined);
var DeviceDispatchContext = createContext(undefined);

console.log('*** DeviceContext.tsx ***');

export {
  DeviceProvider,
  useDeviceState,
  useDeviceDispatch,
  // getDevices,
  getDevice,
  getDeviceAction,
  postDevice,
  postDeviceAction,
  deleteDevice,
  setDeviceAction,
  setPaired,
  setLoadingDevice,
  setDeviceError,
  storeDeviceToken,
  clearError,
};

function DeviceProvider({children}: any) {
  const [state, dispatch] = useReducer(deviceReducer, {
    loading: false,
    paired: false,
    pairToken: '',
    device: {},
    error: null,
  });

  return (
    <DeviceStateContext.Provider value={state}>
      <DeviceDispatchContext.Provider value={dispatch}>
        {children}
      </DeviceDispatchContext.Provider>
    </DeviceStateContext.Provider>
  );
}

function deviceReducer(state: any, action: any) {
  console.log('deviceReducer: ' + action.type);
  switch (action.type) {
    case 'GET_ACTIONS':
      console.log('deviceReducer: GET_ACTIONS');
      return {
        ...state,
        device: {actions: action.payload},
        loading: false,
      };
    case 'GET_DEVICES':
      return {...state, devices: action.payload, loading: false};
    case 'GET_DEVICE':
      return {
        ...state,
        device: action.payload,
        paired: !!action.payload,
        pairToken: action.payload.deviceId,
        loading: false,
      };
    case 'GET_DEVICE_ACTION':
      return {
        ...state,
        device: {...state.device, action: action.payload},
      };
    case 'POST_DEVICE':
      return {
        ...state,
        // device: action.payload,
        loading: false,
      };
    case 'POST_DEVICE_ACTION':
      return {
        ...state,
        device: {...state.device, action: action.payload},
        loading: false,
      };
    case 'DELETE_DEVICE':
      return {
        ...state,
        paired: false,
        pairToken: '',
        device: {},
        loading: false,
      };
    case 'SET_DEVICE_ACTION':
      return {
        ...state,
        device: {...state.device, action: action.action},
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case 'STORE_TOKEN':
      return {
        ...state,
        paired: !!action.token,
        pairToken: action.token,
        device: {deviceId: action.token},
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
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

// ###########################################################
// ###############   EXPORTABLE FUNCTIONS    #################
// ###########################################################

// GET ALL DEVICES
function getDevices(dispatch: any) {
  dispatch({type: 'SET_LOADING', loading: true});
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

// GET DEVICE
function getDevice(dispatch: any, deviceId: string) {
  dispatch({type: 'SET_LOADING', loading: true});
  api
    .get(`/device/${deviceId}`)
    .then((res) => {
      console.log('getDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_DEVICE',
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log('DeviceContext: getDevice: ERROR: ' + err);
      //TODO: retry get_device?
      dispatch({
        type: 'SET_ERROR',
        error: {err, from: 'getDevice'},
      });
    });
}

// GET DEVICE ACTION
function getDeviceAction(dispatch: any, deviceId: string) {
  // dispatch({type: 'SET_LOADING', loading: true});
  api
    .get(`/device/${deviceId}/action`)
    .then((res) => {
      console.log('getDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_DEVICE_ACTION',
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log('DeviceContext: getDevice: ERROR: ' + err);
      //TODO: retry get_device?
      dispatch({
        type: 'SET_ERROR',
        error: {err, from: 'getDevice'},
      });
    });
}

// POST DEVICE
//TODO: FINISH
function postDevice(dispatch: any, deviceId: string) {
  // dispatch({type: 'SET_LOADING', loading: true});
  const newDevice = {
    deviceId,
  };

  api
    .post(`/device/${deviceId}`, newDevice)
    .then((res) => {
      console.log('req = postDevice: ' + JSON.stringify(req.params));
      dispatch({
        type: 'POST_DEVICE',
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log('DeviceContext -> postDevice: ' + err.error);
    });
}

// POST DEVICE_ACTION
//TODO: Infer types / Interface IDevice
function postDeviceAction(dispatch: any, deviceId: string, action: object) {
  console.log(`deviceId = ${deviceId}`);
  console.log('postDeviceAction: ' + JSON.stringify(action));

  api
    .post(`/device/${deviceId}/action`, action)
    .then((res) => {
      console.log('res - postDeviceAction: ' + JSON.stringify(res.data));
      console.log('dataAciton posted = ' + JSON.stringify(res.data.action));
      dispatch({
        type: 'POST_DEVICE_ACTION',
        payload: res.data.action,
      });
      // setLoading(false);
    })
    .catch((err) => {
      console.log('DeviceContext -> postDeviceAction: ' + err);
      dispatch({
        type: 'SET_ERROR',
        // error: err,
        error: {err, from: 'postDeviceAction'},
      });
    });
}

// DELETE DEVICE
//TODO: Retry or at least show error (Network / Not found, etc...) to user
function deleteDevice(dispatch: any, deviceId: string) {
  // dispatch({type: 'SET_LOADING', loading: true});
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
    .catch((err) => {
      console.log('DeviceContext: deleteDevice: ' + err);
      dispatch({type: 'SET_ERROR', error: {err, from: 'deleteDevice'}});
    });
}

// means to update state back to false after waterPump button timeout
function setDeviceAction(dispatch: any, action: object) {
  //TODO: update action - waterPump, action - ledTape
  dispatch({type: 'SET_DEVICE_ACTION', action});
}

// SET PAIRED
function setPaired(dispatch: any, paired: any) {
  dispatch({type: 'SET_PAIRED', paired});
}

// SET LOADING
function setLoadingDevice(dispatch: any, loading: boolean) {
  dispatch({type: 'SET_LOADING', loading});
}

// Is this useful?
function setDeviceError(dispatch: any, error: any, from: string) {
  dispatch({type: 'SET_ERROR', error});
}

// STORE DEVICE / PAIR TOKEN
async function storeDeviceToken(dispatch: any, token: string) {
  try {
    console.log('storeDeviceToken: ' + token);
    await AsyncStorage.setItem('@pairToken', token);
    dispatch({type: 'STORE_TOKEN', token: token, loading: false});
  } catch (e) {
    console.log('ERROR: DeviceContext: ' + e.error);
  }
}

// CLEAR ERROR
const clearError = (dispatch: any) => {
  dispatch({type: 'CLEAR_ERROR'});
};

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
