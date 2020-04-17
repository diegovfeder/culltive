import React from "react";

import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "LOGIN_FAILURE": {
      // TODO: create a message to the user explaining login failed
      console.log("LOGIN_FAILURE");
      return { ...state, isAuthenticated: false };
    }
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("FBIdToken")
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
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  signupUser,
  signOut,
  autoSignIn
};
// ###########################################################

function loginUser(
  dispatch,
  loginValue,
  passwordValue,
  history,
  setIsLoading,
  setError
) {
  setError(false);
  setIsLoading(true);

  const userData = {
    email: loginValue,
    password: passwordValue
  };

  axios
    .post("/login", userData)
    .then(res => {
      console.log(res.data); //Auth token
      setAuthorizationHeader(res.data.token);
      setError(null);
      setIsLoading(false);
      dispatch({ type: "LOGIN_SUCCESS" });
      history.push("/app/home");
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    });
}

// TODO: FINISH THIS METHOD
function signupUser(
  dispatch,
  loginValue,
  passwordValue,
  confirmPasswordValue,
  handleValue,
  history,
  setIsLoading,
  setError
) {
  setError(false);
  setIsLoading(true);

  const newUserData = {
    email: loginValue,
    password: passwordValue,
    confirmPassword: confirmPasswordValue,
    handle: handleValue
  };

  // dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      // dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
    });
}

function signOut(dispatch, history) {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

// TODO: Finish this local storage verification thing
function autoSignIn(dispatch, history) {
  dispatch({ type: "LOGIN_SUCCESS" });
  // history.push("/app/home");
}

function getUserData(dispatch) {
  // dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then(res => {
      // dispatch({
      //   type: SET_USER,
      //   payload: res.data
      // });
    })
    .catch(err => console.log(err));
}

const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
