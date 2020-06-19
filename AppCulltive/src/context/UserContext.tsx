import React, {createContext, useContext, useReducer, useState} from 'react';
import {AsyncStorage} from 'react-native';
import api from 'axios';

var UserStateContext = createContext(undefined);
var UserDispatchContext = createContext(undefined);

console.log('-- UserContext.tsx: ');

function UserProvider({children}) {
  const [state, dispatch] = useReducer(userReducer, {
    authenticated: false,
    loading: true,
    user: '',
    // userData: null,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function userReducer(state, action) {
  switch (action.type) {
    case 'VALIDATE_TOKEN':
      return {
        ...state,
        authenticated: !!action.token,
        loading: false,
      };
    case 'SIGNUP_SUCCESS': {
      console.log('userReducer: SIGNUP_SUCCESS');
      console.log('user: ' + action.payload);
      return {...state, authenticated: true, user: action.payload};
    }
    case 'SIGNUP_FAILURE': {
      // TODO: create a message to the user explaining signup fail
      console.log('userReducer: SIGNUP_FAILURE');
      return {...state, authenticated: false, errors: action.payload};
    }
    case 'SIGNIN_SUCCESS':
      console.log('userReducer: SIGNIN_SUCCESS');
      console.log('user: ' + action.payload);
      return {...state, authenticated: true, user: action.payload};
    case 'SIGNIN_FAILURE': {
      // TODO: create a message to the user explaining SIGNIN fail
      console.log('userReducer: SIGNIN_FAILURE');
      return {...state, authenticated: false, errors: action.payload};
    }
    case 'SIGN_OUT_SUCCESS':
      return {...state, authenticated: false};
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: null,
      };
    case 'GET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useUserState() {
  var context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

function useUserDispatch() {
  var context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  signupUser,
  signinUser,
  signOut,
  getUserData,
  validateUserToken,
  clearErrors,
};
// ###########################################################

// SIGN UP
// TODO: Infer the right types
function signupUser(
  dispatch: any,
  name: any,
  email: any,
  password: any,
  setLoading: any,
) {
  setLoading(true);

  const user = {
    name: name,
    email: email,
    password: password,
  };

  console.log('user: ' + JSON.stringify(user));

  api
    .post('/signup', user)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);
      setLoading(false);
      dispatch({type: 'SIGNUP_SUCCESS', payload: user.email});
      dispatch({type: 'CLEAR_ERRORS'});
    })
    .catch((err) => {
      dispatch({
        type: 'SET_ERRORS',
        payload: err.response.data,
      });
      console.log('signUpUser: ' + err);
      setLoading(false);
      dispatch({type: 'SIGNUP_FAILURE', payload: err.response.data});
      // dispatch({type: 'SET_ERRORS', payload: err.response.data});
    });
}

// SIGN IN
function signinUser(
  dispatch: any,
  email: any,
  password: any,
  setLoading: any,
  // setErrors,
) {
  // TODO: set Errors (connection issues?) 404, 500 etc...
  setLoading(true);

  const user = {
    email: email,
    password: password,
  };
  console.log('user: ' + JSON.stringify(user));

  //TODO: Find a way to retrieve userName and save to context State.
  api
    .post('/signin', user)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);

      setLoading(false);
      dispatch({type: 'SIGNIN_SUCCESS', payload: user.email});
    })
    .catch((err) => {
      console.log('signIn ( ): ' + err);
      setLoading(false);
      dispatch({type: 'SIGNIN_FAILURE', payload: err});
      // dispatch({type: 'SET_ERRORS', payload: err.response.data});
    });
}

function signOut(dispatch: any) {
  console.log('UserContext: signOut' + dispatch);
  AsyncStorage.removeItem('@FBIdToken');
  dispatch({type: 'SIGN_OUT_SUCCESS'});
}

// TODO: Finish function dispatch, userHandle, /user/${userHandle}
// maybe save the user Logged in data in AsyncStorage?..
function getUserData(dispatch: any, handle: string) {
  // dispatch({ type: LOADING_USER });
  // .get(`/user/${diegovfeder@gmail.com}`)
  api
    .get(`/user/${handle}`)
    .then((res) => {
      console.log('getUser: ' + JSON.stringify(res));
      dispatch({
        type: 'GET_USER',
        payload: res.data,
      });
    })
    .catch((err) => console.log('getUser ERROR: ' + err));
}

function validateUserToken(dispatch, userToken) {
  dispatch({type: 'VALIDATE_TOKEN', token: userToken});
}

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  AsyncStorage.setItem('@FBIdToken', FBIdToken);
};

const clearErrors = (dispatch) => {
  dispatch({type: 'CLEAR_ERRORS'});
};
