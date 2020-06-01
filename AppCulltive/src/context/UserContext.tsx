import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import api from 'axios';

var UserStateContext = createContext(undefined);
var UserDispatchContext = createContext(undefined);

console.log('-- UserContext.tsx: ');

function UserProvider({children}) {
  const [state, dispatch] = useReducer(userReducer, {
    authenticated: false,
    loading: true,
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
    case 'VALIDATE_TOKEN':
      // console.log('VALIDATE_TOKEN');
      return {
        ...state,
        authenticated: !!action.token,
        loading: false,
      };
    case 'SIGNUP_SUCCESS': {
      console.log('userReducer: SIGNUP_SUCCESS');
      return {...state, authenticated: true};
    }
    case 'SIGNUP_FAILURE': {
      // TODO: create a message to the user explaining signup fail
      console.log('userReducer: SIGNUP_FAILURE');
      return {...state, signupFailed: action.payload, authenticated: false};
    }
    case 'SIGNIN_SUCCESS':
      console.log('userReducer: SIGNIN_SUCCESS');
      return {...state, authenticated: true};
    case 'SIGNIN_FAILURE': {
      // TODO: create a message to the user explaining SIGNIN fail
      console.log('userReducer: SIGNIN_FAILURE');
      return {...state, signinFailed: action.payload, authenticated: false};
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
        userData: action.payload,
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
  // console.log('* signupUser: ');
  // console.log('name: ' + name);
  // console.log('email: ' + email);
  // console.log('password: ' + password);
  // TODO: set Errors (connection errors) 404, 500 etc...
  // setErrors(null);
  setLoading(true);

  const user = {
    name: name,
    email: email,
    password: password,
  };

  console.log('user: ' + JSON.stringify(user));
  // dispatch({ type: LOADING_UI });
  api
    .post('/signup', user)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
      // setErrors(false);
      setLoading(false);
      dispatch({type: 'SIGNUP_SUCCESS'});
      // dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
      console.log(err.response.data);
      setLoading(false);
      dispatch({type: 'SIGNUP_FAILURE', payload: []});
      // dispatch({ type: "SET_ERRORS", payload: err.response.data });
      // setErrors(true); // change This to payload response data...
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
  console.log('UserContext: signinUser: email: ' + email);
  console.log('UserContext: signinUser: password: ' + password);
  // TODO: set Errors (connection issues?) 404, 500 etc...
  // setErrors(false);
  setLoading(true);

  const user = {
    email: email,
    password: password,
  };

  api
    .post('/signin', user)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);

      // setErrors(false);
      setLoading(false);
      dispatch({type: 'SIGNIN_SUCCESS'});
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      dispatch({type: 'SIGNIN_FAILURE', payload: []});
      // dispatch({ type: "SET_ERRORS", payload: err.response.data });
      // setErrors(true); // change This to payload response data...
    });
}

function signOut(dispatch: any) {
  console.log('UserContext: signOut' + dispatch);
  AsyncStorage.removeItem('@FBIdToken');
  dispatch({type: 'SIGN_OUT_SUCCESS'});
}

// TODO: Finish function dispatch, userHandle, /user/${userHandle}
// maybe save the user Logged in data in AsyncStorage?..
function getUserData(dispatch) {
  // dispatch({ type: LOADING_USER });
  // .get(`/user/${diegovfeder@gmail.com}`)
  api
    .get('/user/diegovfeder@gmail.com')
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
