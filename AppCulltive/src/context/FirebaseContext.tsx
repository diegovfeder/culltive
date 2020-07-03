import React from 'react';

import Firebase from '../util/firebase';

var FirebaseStateContext = React.createContext();
var FirebaseDispatchContext = React.createContext();

function firebaseReducer(state, action) {
  switch (action.type) {
    case 'EMAIL_RESET_SUCCESS':
      console.log('EMAIL_RESET_SUCCESS');
      return {...state, isReset: true};
    case 'EMAIL_RESET_FAILURE': {
      // TODO: create a message to the user explaining email reset failed
      console.log('EMAIL_RESET_FAILURE');
      return {...state, isReset: false};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function FirebaseProvider({children}) {
  var [state, dispatch] = React.useReducer(firebaseReducer, {
    isReset: false,
  });

  return (
    <FirebaseStateContext.Provider value={state}>
      <FirebaseDispatchContext.Provider value={dispatch}>
        {children}
      </FirebaseDispatchContext.Provider>
    </FirebaseStateContext.Provider>
  );
}

function useFirebaseState() {
  var context = React.useContext(FirebaseStateContext);
  if (context === undefined) {
    throw new Error('useFirebaseState must be used within a FirebaseProvider');
  }
  return context;
}

function useFirebaseDispatch() {
  var context = React.useContext(FirebaseDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useFirebaseDispatch must be used within a FirebaseProvider',
    );
  }
  return context;
}

export {FirebaseProvider, useFirebaseState, useFirebaseDispatch, resetPassword};
// ###########################################################

function resetPassword(dispatch, email, setIsLoading) {
  // setErrors(false);
  setIsLoading(true);

  console.log('resetPassword - email: ' + email);

  // Email validation
  if (email !== '') {
    Firebase.auth
      .sendPasswordResetEmail(email)
      .then(function () {
        alert('Email has been sent to you. Please check and verify.');
        dispatch({type: 'EMAIL_RESET_SUCCESS'});
        setIsLoading(false);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        alert('Message : ' + errorMessage);
        dispatch({type: 'EMAIL_RESET_FAIL'});
        setIsLoading(false);
      });
  } else {
    alert('Please write your email first');
    setIsLoading(false);
  }
}
