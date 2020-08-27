import React, {createContext, useContext} from 'react';

import api from '../util/api';

let ActState = createContext(undefined);
let ActDispatch = createContext(undefined);

console.log('*** ActContext.tsx ***');

function ActProvider({children}: any) {
  const [state, dispatch] = React.useReducer(actReducer, {
    loading: false,
    acts: [],
    error: null,
  });
  return (
    <ActState.Provider value={state}>
      <ActDispatch.Provider value={dispatch}>{children}</ActDispatch.Provider>
    </ActState.Provider>
  );
}

function actReducer(state: any, action: any) {
  switch (action.type) {
    case 'LOADING_ACTS':
      return {...state, loading: true};
    case 'GET_ACTS':
      return {...state, acts: action.payload, loading: false};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useActState() {
  let context = useContext(ActState);
  if (context === undefined) {
    throw new Error('useActState must be used within a ActProvider');
  }
  return context;
}

function useActDispatch() {
  let context = useContext(ActDispatch);
  if (context === undefined) {
    throw new Error('useActDispatch must be used within a ActProvider');
  }
  return context;
}

export {ActProvider, useActState, useActDispatch, getActs};
// ###########################################################

function getActs(dispatch: any) {
  dispatch({type: 'LOADING_ACTS'});
  api
    .get('/acts')
    .then((response) => {
      dispatch({type: 'GET_ACTS', payload: response.data});
    })
    .catch((error) => {
      dispatch({type: 'GET_ACTS', error: error});
    });
}

//TODO: getAct:device

function getAct(dispatch: any, deviceId: string) {
  dispatch({type: 'LOADING_ACTS'});
  api
    .get(`/act:${deviceId}`)
    .then((response) => {
      dispatch({type: 'GET_ACTS', payload: response.data});
    })
    .catch((error) => {
      dispatch({type: 'GET_ACTS', error: error});
    });
}

// getRecentActs : N most recent acts from firestore/acts queried by deviceId
function getRecentActs(dispatch: any, deviceId: string) {
  dispatch({type: 'LOADING_ACTS'});
  api
    .get(`/act:${deviceId}`)
    .then((response) => {
      dispatch({type: 'GET_ACTS', payload: response.data});
    })
    .catch((error) => {
      dispatch({type: 'GET_ACTS', error: error});
    });
}
