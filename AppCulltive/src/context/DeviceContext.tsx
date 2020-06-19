import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import axios from 'axios';

var DeviceStateContext = createContext(undefined);
var DeviceDispatchContext = createContext(undefined);

function DeviceProvider({children}) {
  const [state, dispatch] = useReducer(deviceReducer, {
    paired: false,
    deviceData: null,
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

function deviceReducer(state, action) {
  switch (action.type) {
    case 'VALIDATE_TOKEN':
      return {
        ...state,
        paired: !!action.token,
      };
    case 'GET_DEVICE':
      return {
        ...state,
        deviceData: action.payload,
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
// case 'SET_DEVICE_TOKEN':
//   console.log('DeviceContext: deviceReducer: SET_DEVICE_TOKEN');
//   console.log('pairState: action.payload = ' + action.payload);
//   return {
//     ...state,
//     paired: action.payload,
//   };

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
  getDeviceData,
  deleteDevice,
  validateDeviceToken,
  waterPump,
};
// ###########################################################

// TODO: Finish this function -- get device by id
function getDeviceData(dispatch) {
  // dispatch({ type: LOADING_Device });
  // .get(`/Device/${diegovfeder@gmail.com}`)
  axios
    .get('/device/culltive000')
    .then((res) => {
      console.log('getDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_DEVICE',
        payload: res.data,
      });
    })
    .catch((err) => console.log('DeviceContext: getDeviceData: ERROR: ' + err));
}

// TODO: Finish this function -- delete device by id
function deleteDevice(dispatch) {
  // dispatch({ type: LOADING_Device });
  // .get(`/Device/${diegovfeder@gmail.com}`)
  axios
    .delete('/device/culltive000')
    .then((res) => {
      console.log('getDevice: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_DEVICE',
        payload: res.data,
      });
    })
    .catch((err) => console.log('DeviceContext: getDeviceData: ERROR: ' + err));
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
