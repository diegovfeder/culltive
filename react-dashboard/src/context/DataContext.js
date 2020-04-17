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
      dispatch({ type: "GET_DEVICES", payload: res.data });
      console.log("devices", res);
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
      dispatch({ type: "GET_READINGS", payload: res.data });
      console.log("readings", res);
    })
    .catch(err => {
      dispatch({ type: "GET_READINGS", payload: [] });
    });
}
