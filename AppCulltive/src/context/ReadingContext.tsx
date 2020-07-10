import React, {createContext, useContext} from 'react';

import api from '../util/api';

let ReadingState = createContext(undefined);
let ReadingDispatch = createContext(undefined);

console.log('*** ReadingContext.tsx ***');

function ReadingProvider({children}: any) {
  const [state, dispatch] = React.useReducer(readingReducer, {
    loading: false,
    readings: [],
    error: null,
  });
  return (
    <ReadingState.Provider value={state}>
      <ReadingDispatch.Provider value={dispatch}>
        {children}
      </ReadingDispatch.Provider>
    </ReadingState.Provider>
  );
}

function readingReducer(state: any, action: any) {
  switch (action.type) {
    case 'LOADING_READINGS':
      return {...state, loading: true};
    case 'GET_READINGS':
      return {...state, readings: action.payload, loading: false};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useReadingState() {
  let context = useContext(ReadingState);
  if (context === undefined) {
    throw new Error('useReadingState must be used within a ReadingProvider');
  }
  return context;
}

function useReadingDispatch() {
  let context = useContext(ReadingDispatch);
  if (context === undefined) {
    throw new Error('useReadingDispatch must be used within a ReadingProvider');
  }
  return context;
}

export {ReadingProvider, useReadingState, useReadingDispatch, getReadings};
// ###########################################################

function getReadings(dispatch: any) {
  dispatch({type: 'LOADING_READINGS'});
  api
    .get('/readings')
    .then((response) => {
      dispatch({type: 'GET_READINGS', payload: response.data});
    })
    .catch((error) => {
      dispatch({type: 'GET_READINGS', error: error});
    });
}
