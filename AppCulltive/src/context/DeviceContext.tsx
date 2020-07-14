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
  // getDevices,
  getDevice,
  getDeviceAction,
  postDevice,
  postDeviceAction,
  deleteDevice,
  setLoadingDevice,
  storeDeviceToken,
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
    // case 'GET_DEVICES':
    //   console.log('deviceReducer: GET_DEVICES');
    //   return {...state, devices: action.payload, loading: false};
    case 'GET_ACTIONS':
      console.log('deviceReducer: GET_ACTIONS');
      return {
        ...state,
        device: {actions: action.payload},
        loading: false,
      };
    case 'GET_DEVICE':
      console.log('deviceReducer: GET_DEVICE');
      return {
        ...state,
        device: action.payload,
        paired: !!action.payload,
        pairToken: action.payload.deviceId,
        loading: false,
      };
    case 'GET_DEVICE_ACTION':
      console.log('deviceReducer: GET_DEVICE_ACTION');
      return {
        ...state,
        device: {...state.device, action: action.payload},
      };
    case 'POST_DEVICE':
      console.log('deviceReducer: POST_DEVICE');
      return {
        ...state,
        // device: action.payload,
        loading: false,
      };
    case 'POST_DEVICE_ACTION':
      console.log('deviceReducer: POST_DEVICE_ACTION');
      return {
        ...state,
        device: action.payload,
        loading: false,
      };
    case 'DELETE_DEVICE':
      console.log('deviceReducer: DELETE_DEVICE');
      return {
        ...state,
        paired: false,
        pairToken: '',
        device: {},
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
        device: {deviceId: action.token},
      };
    //TODO: POST ACTIONS...
    case 'WATER_PUMP':
      console.log('deviceReducer: WATER_PUMP');
      return {
        ...state,
        device: {waterPump: true},
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
// function getDevices(dispatch) {
//   dispatch({type: 'SET_LOADING', loading: true});
//   api
//     .get('/devices')
//     .then((res) => {
//       // console.log("devices: ", res);
//       dispatch({type: 'GET_DEVICES', payload: res.data});
//     })
//     .catch((err) => {
//       dispatch({type: 'GET_DEVICES', payload: []});
//     });
// }

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

// GET DEVICE ACTION
function getDeviceAction(dispatch, deviceId) {
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
        error: err,
      });
    });
}

// POST DEVICE
//TODO: FINISH
function postDevice(dispatch, deviceId) {
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
      console.log('ERROR: ' + err.error);
    });
}

// POST DEVICE ACTIONS (LED_TAPE && WATER_PUMP)
// function postDeviceAction();

// POST DEVICE_ACTION

//TODO: Infer types / Interface IDevice
function postDeviceAction(dispatch: any, deviceId: string, action: object) {
  // dispatch({type: 'SET_LOADING', loading: true});
  // setLoading(true);
  console.log(`deviceId = ${deviceId}`);
  console.log('postDeviceAction: ' + JSON.stringify(action));

  //FINISH
  const newAction = action;

  console.log(`newAction = ${JSON.stringify(newAction)}`);

  //TODO: FINISH THIS
  api
    .post(`/device/${deviceId}/action`, newAction)
    .then((res) => {
      // console.log('res - postDeviceAction: ' + JSON.stringify(res));
      dispatch({
        type: 'POST_DEVICE_ACTION',
        payload: res.data.device,
      });
      // setLoading(false);
    })
    .catch((err) => {
      console.log('DeviceContext: ' + err);
    });
}

// DELETE DEVICE
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
    .catch((err) => console.log('DeviceContext: deleteDevice: ERROR: ' + err));
}

// SET LOADING
function setLoadingDevice(dispatch: any, loading: boolean) {
  dispatch({type: 'SET_LOADING', loading});
}

// STORE DEVICE / PAIR TOKEN
async function storeDeviceToken(dispatch: any, token: string, isLoading: any) {
  try {
    console.log('storeDeviceToken: ' + token);
    await AsyncStorage.setItem('@pairToken', token);
    dispatch({type: 'STORE_TOKEN', token: token});
    isLoading(false);
  } catch (e) {
    console.log('ERROR: DeviceContext: ' + e.error);
  }
}

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
