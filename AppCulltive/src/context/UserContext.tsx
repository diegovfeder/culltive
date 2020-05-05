import React, {createContext, useContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import axios from 'axios';

var UserStateContext = createContext(undefined);
var UserDispatchContext = createContext(undefined);

function userReducer(state, action) {
  switch (action.type) {
    case 'VALIDATE_TOKEN':
      // console.log('VALIDATE_TOKEN');
      return {
        ...state,
        authenticated: !!action.token,
        loading: false,
      };
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS');
      return {...state, authenticated: true};
    case 'LOGIN_FAILURE': {
      // TODO: create a message to the user explaining login fail
      console.log('LOGIN_FAILURE');
      return {...state, loginFailed: action.payload, authenticated: false};
    }
    case 'SIGNUP_SUCCESS': {
      console.log('SIGNUP_SUCCESS');
      return {...state, authenticated: true};
    }
    case 'SIGNUP_FAILURE': {
      // TODO: create a message to the user explaining signup fail
      console.log('SIGNUP_FAILURE');
      return {...state, signupFailed: action.payload, authenticated: false};
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

// authenticated: !!AsyncStorage.getItem("FBIdToken")
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
  signinUser,
  signupUser,
  signOut,
  getUserData,
  validateToken,
};
// ###########################################################

function signinUser(
  dispatch,
  loginValue,
  passwordValue,
  setIsLoading,
  // setErrors,
) {
  // setErrors(false);
  setIsLoading(true);

  console.log('login: ' + loginValue);
  console.log('password: ' + passwordValue);

  const userData = {
    email: loginValue,
    password: passwordValue,
  };

  axios
    .post('/login', userData)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);

      // setErrors(false);
      setIsLoading(false);
      dispatch({type: 'LOGIN_SUCCESS'});
    })
    .catch((err) => {
      console.log(err);
      dispatch({type: 'LOGIN_FAILURE', payload: []});
      // dispatch({ type: "SET_ERRORS", payload: err.response.data });
      // setErrors(true); // change This to payload response data...
      setIsLoading(false);
    });
}

// TODO: FINISH THIS METHOD
function signupUser(
  dispatch,
  userNameValue,
  loginValue,
  passwordValue,
  setIsLoading,
  setErrors,
) {
  setErrors(null);
  setIsLoading(true);

  const newUserData = {
    userName: userNameValue,
    email: loginValue,
    password: passwordValue,
  };

  // dispatch({ type: LOADING_UI });
  axios
    .post('/signup', newUserData)
    .then((res) => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
      setErrors(false);
      setIsLoading(false);
      dispatch({type: 'SIGNUP_SUCCESS'});
      // dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
      console.log(err);
      dispatch({type: 'SIGNUP_FAILURE', payload: []});
      // dispatch({ type: "SET_ERRORS", payload: err.response.data });
      setErrors(true); // change This to payload response data...
      setIsLoading(false);
    });
}

function signOut(dispatch) {
  AsyncStorage.removeItem('FBIdToken');
  dispatch({type: 'SIGN_OUT_SUCCESS'});
}

function getUserData(dispatch) {
  // dispatch({ type: LOADING_USER });
  // .get(`/user/${diegovfeder@gmail.com}`)
  axios
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

function validateToken(dispatch, userToken) {
  dispatch({type: 'VALIDATE_TOKEN', token: userToken});
}

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  AsyncStorage.setItem('FBIdToken', FBIdToken);
};
