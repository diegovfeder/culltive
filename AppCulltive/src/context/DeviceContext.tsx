import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import api from '../util/api';

//TODO: useReducer with typescript but passing Types for initial values
var DeviceStateContext = createContext(undefined);

var DeviceDispatchContext = createContext(undefined);

console.log('*** DeviceContext.tsx ***');

export {
  DeviceProvider,
  useDeviceState,
  useDeviceDispatch,
  getDevices,
  getDevice,
  // postDevice,
  // postDeviceActions,
  deleteDevice,
  setLoadingDevice,
  storeDeviceToken,
  waterPump,
  setDeviceName,
};

function DeviceProvider({children}: any) {
  const [state, dispatch] = useReducer(deviceReducer, {
    loading: true,
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
  switch (action.type) {
    case 'GET_DEVICES':
      console.log('deviceReducer: GET_DEVICES');
      return {...state, devices: action.payload, loading: false};
    case 'GET_DEVICE':
      console.log('deviceReducer: GET_DEVICES');
      return {
        ...state,
        deviceData: action.payload,
        loading: false,
      };
    case 'DELETE_DEVICE':
      console.log('deviceReducer: DELETE_DEVICE');
      return {
        ...state,
        paired: false,
        pairToken: '',
        loading: false,
      };
    case 'SET_LOADING':
      console.log('deviceReducer: SET_LOADING');
      return {
        ...state,
        loading: action.loading,
      };
    case 'SET_ERROR':
      console.log('deviceReducer: SET_ERROR');
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case 'STORE_TOKEN':
      console.log('deviceReducer: STORE_TOKEN');
      return {
        ...state,
        paired: !!action.token,
        pairToken: action.token,
      };
    case 'WATER_PUMP':
      console.log('deviceReducer: WATER_PUMP');
      return {
        ...state,
        waterpumpss: false,
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
function getDevices(dispatch) {
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
function getDevice(dispatch, deviceId) {
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
        error: err,
      });
    });
}

// POST DEVICE
// function postDevice()

// POST DEVICE ACTIONS (LED_TAPE && WATER_PUMP)
// function postDeviceAction();

// DELETE DEVICE
function deleteDevice(dispatch, deviceId) {
  dispatch({type: 'SET_LOADING', loading: true});
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

//FIXME:
function setDeviceName(dispatch, deviceId) {
  dispatch({type: 'SET_LOADING', loading: true});
  console.log('DeviceContext: setDeviceName()');
  console.log(`deviceId = ${deviceId}`);
  dispatch({type: 'SET_DEVICE', name: deviceId});
}

// SET LOADING
function setLoadingDevice(dispatch: any, loading: boolean) {
  dispatch({type: 'SET_LOADING', loading});
}

function storeDeviceToken(dispatch, token) {
  dispatch({type: 'STORE_TOKEN', token: token});
}

// const storeDeviceToken = async (value) => {
//   try {
//     console.log('storeDeviceToken: ' + value);
//     AsyncStorage.setItem('@pairToken', value);
//   } catch (e) {
//     console.log(e.error);
//   }
// };

function waterPump(dispatch, setLoading) {
  setLoading(true);
  setTimeout(() => {
    dispatch({type: 'WATER_PUMP'});
  }, 2000);
}

// const storeDeviceToken = async (value) => {
//   try {
//     console.log('storeDeviceToken: ' + value);
//     AsyncStorage.setItem('@deviceToken', value);
//   } catch (e) {
//     console.log(e.error);
//   }
// };

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
