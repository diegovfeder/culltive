import React, {createContext, useContext} from 'react';

import axios from 'axios';

let DataStateContext = createContext();
let DataDispatchContext = createContext();

function DataProvider({children}) {
  const [state, dispatch] = React.useReducer(dataReducer, {
    devices: [],
    loadingDevices: false,
    readings: [],
    loadingReadings: false,
  });
  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'LOADING_DEVICES':
      return {...state, loadingDevices: true};
    case 'LOADING_READINGS':
      return {...state, loadingReadings: true};
    case 'GET_READINGS':
      return {...state, readings: action.payload, loadingReadings: false};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useDataState() {
  let context = useContext(DataStateContext);
  if (context === undefined) {
    throw new Error('useDataState must be used within a DataProvider');
  }
  return context;
}

function useDataDispatch() {
  let context = useContext(DataDispatchContext);
  if (context === undefined) {
    throw new Error('useDataDispatch must be used within a DataProvider');
  }
  return context;
}

export {DataProvider, useDataState, useDataDispatch, getReadings};
// ###########################################################

function getReadings(dispatch) {
  dispatch({type: 'LOADING_READINGS'});
  axios
    .get('/readings')
    .then((res) => {
      // console.log("readings: ", res);
      // res.data.map(key => console.log("createdAt: " + key.createdAt));
      const myMap = res.data.map((key) => console.log('air: ' + key.air));
      dispatch({type: 'GET_READINGS', payload: res.data});
    })
    .catch((err) => {
      dispatch({type: 'GET_READINGS', payload: []});
    });
}

// FIXME: Code below separates air and createdAt
// var readings = res.data;
// var keys = Object.keys(readings);
// // console.log("keys: ", keys);
// for (var i = 0; i, keys.length; i++) {
//   var k = keys[i];
//   var air = readings[k].air;
//   var createdAt = readings[k].createdAt;
//   console.log(createdAt, air);
// }
