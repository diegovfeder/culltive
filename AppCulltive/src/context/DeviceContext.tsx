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
    case 'SET_PAIRED':
      console.log('DeviceContext: deviceReducer: SET_PAIRED');
      return {
        ...state,
        paired: true,
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
  setPaired,
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

function setPaired(dispatch) {
  dispatch({type: 'SET_PAIRED'});
}

function waterPump(dispatch, setLoading) {
  setLoading(true);
  setTimeout(() => {
    dispatch({type: 'WATER_PUMP'});
  }, 2000);
}

// function validateDeviceToken(dispatch, deviceToken) {
//   dispatch({type: 'VALIDATE_DEVICE_TOKEN', token: deviceToken});
// }
