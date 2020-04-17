import React from "react";

import axios from "axios";

var DataStateContext = React.createContext();
var DataDispatchContext = React.createContext();

function dataReducer(state, action) {
  switch (action.type) {
    case "LOADING_DEVICES":
      return { ...state, loadingDevices: true };
    case "GET_DEVICES":
      return { ...state, devices: action.payload, loadingDevices: false };
    case "LOADING_READINGS":
      return { ...state, loadingReadings: true };
    case "GET_READINGS":
      return { ...state, readings: action.payload, loadingReadings: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DataProvider({ children }) {
  var [state, dispatch] = React.useReducer(dataReducer, {
    devices: [],
    loadingDevices: false,
    readings: [],
    loadingReadings: false
  });
  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

function useDataState() {
  var context = React.useContext(DataStateContext);
  if (context === undefined) {
    throw new Error("useDataState must be used within a DataProvider");
  }
  return context;
}

function useDataDispatch() {
  var context = React.useContext(DataDispatchContext);
  if (context === undefined) {
    throw new Error("useDataDispatch must be used within a DataProvider");
  }
  return context;
}

export { DataProvider, useDataState, useDataDispatch, getDevices, getReadings };
// ###########################################################

function getDevices(dispatch) {
  dispatch({ type: "LOADING_DEVICES" });
  axios
    .get("/devices")
    .then(res => {
      // console.log("devices: ", res);
      dispatch({ type: "GET_DEVICES", payload: res.data });
    })
    .catch(err => {
      dispatch({ type: "GET_DEVICES", payload: [] });
    });
}

function getReadings(dispatch) {
  dispatch({ type: "LOADING_READINGS" });
  axios
    .get("/readings")
    .then(res => {
      // console.log("readings: ", res);
      // res.data.map(key => console.log("createdAt: " + key.createdAt));
      myMap = res.data.map(key => console.log("air: " + key.air));
      dispatch({ type: "GET_READINGS", payload: res.data });
    })
    .catch(err => {
      dispatch({ type: "GET_READINGS", payload: [] });
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
