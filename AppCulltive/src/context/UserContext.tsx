import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';

import api from '../util/api';

interface IUserContext {
  authenticated: boolean;
  authToken: string;
  loading: boolean;
  user: IUser;
  error: string;
}

interface IUser {
  createdAt: string;
  device: string;
  email: string;
  name: string;
  userId: string;
}

var UserStateContext = createContext(undefined);
var UserDispatchContext = createContext(undefined);

console.log('*** UserContext.tsx ***');

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  signupUser,
  signinUser,
  signOut,
  getAuthenticatedUser,
  setLoadingUser,
  setUserError,
  storeUserToken,
  clearUserDevice,
  clearError,
};

function UserProvider({children}: any) {
  const [state, dispatch] = useReducer(userReducer, {
    authenticated: false,
    authToken: '',
    loading: false,
    user: {},
    error: null,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function userReducer(state: any, action: any) {
  console.log('userReducer: ' + action.type);
  switch (action.type) {
    case 'SIGNUP_SUCCESS': {
      return {
        ...state,
        authenticated: true,
        authToken: action.token,
        user: action.user,
        error: action.error,
      };
    }
    case 'SIGNUP_FAILURE': {
      return {...state, authenticated: false, error: action.error};
    }
    case 'SIGNIN_SUCCESS':
      return {
        ...state,
        authenticated: true,
        authToken: action.token,
        user: action.user,
        error: action.error,
      };
    case 'SIGNIN_FAILURE': {
      return {...state, authenticated: false, error: action.error};
    }
    case 'SIGN_OUT_SUCCESS':
      return {
        ...state,
        authenticated: false,
        authToken: null,
        user: {},
      };
    case 'GET_USER':
      return {
        ...state,
        authenticated: !!action.payload,
        loading: false,
        user: action.payload,
      };
    case 'SET_PAIRED':
      return {...state, paired: action.paired};
    case 'SET_LOADING':
      return {...state, loading: action.loading};
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'STORE_TOKEN':
      return {
        ...state,
        authenticated: !!action.token,
        authToken: action.token,
        loading: false,
      };
    case 'CLEAR_USER_DEVICE':
      return {
        ...state,
        user: {...state.user, device: ''},
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
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

// ###########################################################
// ###############   EXPORTABLE FUNCTIONS    #################
// ###########################################################

// SIGN UP
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
    .then((response) => {
      console.log(response.data); //Auth token
      storeUserToken(dispatch, response.data.token, setLoading);
      dispatch({
        type: 'SIGNUP_SUCCESS',
        user: {email: user.email},
        token: response.data.token,
        error: null,
      });
    })
    .catch((err) => {
      console.log('signUpUser: ' + err);
      setLoading(false);
      dispatch({type: 'SIGNUP_FAILURE', error: err.response.data});
    });
}

// SIGN IN
function signinUser(dispatch: any, email: any, password: any, setLoading: any) {
  setLoading(true);

  const user = {
    email: email,
    password: password,
  };

  api
    .post('/signin', user)
    .then(async (response) => {
      await storeUserToken(dispatch, response.data.token, setLoading);
      dispatch({
        type: 'SIGNIN_SUCCESS',
        user: {email: user.email},
        token: response.data.token,
        error: null,
      });
      //TODO: ?
      // getAuthenticatedUser(dispatch);
    })
    .catch((err) => {
      console.log('signIn (): ' + err);
      setLoading(false);
      dispatch({type: 'SIGNIN_FAILURE', error: err});
    });
}

//SIGN OUT
async function signOut(dispatch: any) {
  console.log('UserContext: signOut');
  await AsyncStorage.removeItem('@authToken');
  dispatch({type: 'SIGN_OUT_SUCCESS'});
}

//GET USER
function getAuthenticatedUser(dispatch: any) {
  setLoadingUser(dispatch, true);
  api
    .get('/user')
    .then((response) => {
      console.log('getAuthenticatedUser: ' + JSON.stringify(response.data));
      dispatch({
        type: 'GET_USER',
        payload: response.data,
      });
    })
    .catch((error) => {
      console.log('getAuthenticatedUser ERROR: ' + JSON.stringify(error));
    });
}

// SET LOADING
function setLoadingUser(dispatch: any, loading: boolean) {
  dispatch({type: 'SET_LOADING', loading});
}

// SET ERROR
function setUserError(dispatch: any, error: string) {
  dispatch({type: 'SET_ERROR', error});
}

// STORE USER / AUTH TOKEN
async function storeUserToken(dispatch: any, token: string, isLoading: any) {
  try {
    console.log('storeUserToken: ' + token);
    const authToken = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = authToken;
    await AsyncStorage.setItem('@authToken', token);
    dispatch({type: 'STORE_TOKEN', token: token});
    isLoading(false);
  } catch (e) {
    console.log('ERROR: DeviceContext: ' + e.error);
  }
}
// CLEAR ERROR
const clearUserDevice = (dispatch: any) => {
  dispatch({type: 'CLEAR_USER_DEVICE'});
};

// CLEAR ERROR
const clearError = (dispatch: any) => {
  dispatch({type: 'CLEAR_ERROR'});
};
