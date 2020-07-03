import React, {createContext, useContext, useReducer, useState} from 'react';
import {AsyncStorage} from 'react-native';
import api from '../util/api';
import {analytics} from 'firebase';

var UserStateContext = createContext(undefined);
var UserDispatchContext = createContext(undefined);

//TODO: get data from UserContext
// -- There is problem when passing {user} to device as "" so state stays on validatingCredentials
// -- Fix state-machine logic // add timeOut for app and esp8266.

//TODO: Find a way to console.log everytime a file is used.
// To be exact, every time a function on this file runs, the following log should also.
console.log('*** UserContext.tsx ***');

function UserProvider({children}) {
  const [state, dispatch] = useReducer(userReducer, {
    authenticated: false,
    loading: true,
    errors: null,
    user: '',
    token: '',
    userData: null,
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
    case 'SET_LOADING':
      return {...state, loading: action.loading};
    case 'VALIDATE_TOKEN':
      return {
        ...state,
        authenticated: !!action.token,
        token: action.token,
        loading: false,
      };
    case 'SIGNUP_SUCCESS': {
      console.log('userReducer: SIGNUP_SUCCESS');
      return {
        ...state,
        authenticated: true,
        user: action.user,
        token: action.token,
      };
    }
    case 'SIGNUP_FAILURE': {
      // TODO: create a message to the user explaining signup fail
      console.log('userReducer: SIGNUP_FAILURE');
      return {...state, authenticated: false, errors: action.payload};
    }
    case 'SIGNIN_SUCCESS':
      console.log('userReducer: SIGNIN_SUCCESS');
      return {
        ...state,
        authenticated: true,
        user: action.user,
        token: action.token,
      };
    case 'SIGNIN_FAILURE': {
      // TODO: create a message to the user explaining SIGNIN fail
      console.log('userReducer: SIGNIN_FAILURE');
      return {...state, authenticated: false, errors: action.payload};
    }
    case 'SIGN_OUT_SUCCESS':
      return {
        ...state,
        authenticated: false,
        token: null,
        userData: {},
        user: '',
        device: '',
        name: '',
      };
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
        userData: action.payload,

        user: action.payload.email,
        device: action.payload.device,
        name: action.payload.name,
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
  changeLoadingState,
  clearErrors,
  saveUserToken,
  getUser,
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

  api
    .post('/signup', user)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(dispatch, res.data.token);
      setLoading(false);
      dispatch({
        type: 'SIGNUP_SUCCESS',
        user: user.email,
        token: res.data.token,
      });
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
  // console.log('user: ' + JSON.stringify(user));

  //TODO: Find a way to retrieve userName and save to context State.
  api
    .post('/signin', user)
    .then((res) => {
      // console.log(res.data); //Auth token
      setAuthorizationHeader(dispatch, res.data.token);

      setLoading(false);
      dispatch({
        type: 'SIGNIN_SUCCESS',
        user: user.email,
        token: res.data.token,
      });
    })
    .catch((err) => {
      console.log('signIn (): ERROR: ' + err);
      setLoading(false);
      dispatch({type: 'SIGNIN_FAILURE', payload: err});
      // dispatch({type: 'SET_ERRORS', payload: err.response.data});
    });
}

function signOut(dispatch: any) {
  console.log('UserContext: signOut');
  AsyncStorage.removeItem('@FBIdToken');
  dispatch({type: 'SIGN_OUT_SUCCESS'});
}

const clearErrors = (dispatch) => {
  dispatch({type: 'CLEAR_ERRORS'});
};

function saveUserToken(dispatch, token) {
  // console.log('UserContext: savetoken: ' + token);
  setAuthorizationHeader(dispatch, token);
}

const setAuthorizationHeader = async (dispatch, token) => {
  console.log('UserContext: setAuthorizationHeader');
  const FBIdToken = `Bearer ${token}`;
  api.defaults.headers.common['Authorization'] = FBIdToken;
  //Saving token without Bearer, so always insert Bearer in the string literal when dealing with it here.
  await AsyncStorage.setItem('@FBIdToken', token);
  dispatch({type: 'VALIDATE_TOKEN', token: token});
};

// TODO: Finish function dispatch, userHandle, /user/${userHandle}
// maybe save the user Logged in data in AsyncStorage?..
// const bodyParameters = {
//   key: "value"
function getUser(dispatch: any, handle: string, userToken: string | null) {
  //??
  // dispatch({ type: LOADING_USER });
  // console.log(
  //   'UserContext: getUser! ' + ' handle: ' + handle + ' token: ' + userToken,
  // );
  const config = {
    headers: {Authorization: `Bearer ${userToken}`},
  };
  api
    .get(`/user/${handle}?${userToken}`, config)
    .then((res) => {
      console.log('getUser: ' + JSON.stringify(res.data));
      dispatch({
        type: 'GET_USER',
        payload: res.data,
      });
    })
    .catch((err) => {
      // console.log('getUser: ' + JSON.stringify(res.data));
      console.log('getUser ERROR: ' + JSON.stringify(err));
    });

  //Learn how to pass token in Authorization ?query
  // api
  //   .get(`/user/${handle}?${userToken}`)
  //   .then((res) => {
  //     console.log('getUser: ' + JSON.stringify(res));
  //     dispatch({
  //       type: 'GET_USER',
  //       payload: res.data,
  //     });
  //   })
  //   .catch((err) => console.log('getUser ERROR: ' + err));
}

function changeLoadingState(dispatch: any, loading: boolean) {
  dispatch({type: 'SET_LOADING', loading});
}
