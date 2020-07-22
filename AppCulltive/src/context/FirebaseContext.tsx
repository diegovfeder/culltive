import React, {createContext, useContext, useReducer} from 'react';
import {Alert} from 'react-native';

// Firebase config and auth
import Firebase from '../util/firebase';

interface IFirebase {
  //...
}

var FirebaseStateContext = createContext(undefined);
var FirebaseDispatchContext = createContext(undefined);

console.log('*** FirebaseContext.tsx ***');

export {
  FirebaseProvider,
  useFirebaseState,
  useFirebaseDispatch,
  resetPassword,
  setIsReset,
};

function FirebaseProvider({children}: any) {
  var [state, dispatch] = useReducer(firebaseReducer, {
    isReset: false,
    error: null,
  });

  return (
    <FirebaseStateContext.Provider value={state}>
      <FirebaseDispatchContext.Provider value={dispatch}>
        {children}
      </FirebaseDispatchContext.Provider>
    </FirebaseStateContext.Provider>
  );
}

function firebaseReducer(state: any, action: any) {
  switch (action.type) {
    case 'EMAIL_RESET_SUCCESS':
      console.log('EMAIL_RESET_SUCCESS');
      return {...state, isReset: true};
    case 'EMAIL_RESET_FAIL': {
      console.log('EMAIL_RESET_FAIL');
      return {...state, isReset: false, error: action.error};
    }
    case 'SET_IS_RESET': {
      console.log('SET_IS_RESET');
      return {...state, isReset: action.isReset};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useFirebaseState() {
  var context = useContext(FirebaseStateContext);
  if (context === undefined) {
    throw new Error('useFirebaseState must be used within a FirebaseProvider');
  }
  return context;
}

function useFirebaseDispatch() {
  var context = useContext(FirebaseDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useFirebaseDispatch must be used within a FirebaseProvider',
    );
  }
  return context;
}

// ###########################################################
// ###############   EXPORTABLE FUNCTIONS    #################
// ###########################################################

// RESET PASSWORD
function resetPassword(dispatch: any, email: string, setLoading: any) {
  console.log('FirebaseContext.tsx => resetPassword: email: ' + email);
  setLoading(true);
  // setErrors(false);

  // Email validation
  if (email !== '') {
    Firebase.auth
      .sendPasswordResetEmail(email)
      .then(function () {
        dispatch({type: 'EMAIL_RESET_SUCCESS'});
        setLoading(false);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        Alert.alert(
          'Ops...',
          'Encontramos um problema durante o processo.' + '\n\n' + error,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                // clearError(dispatch);
              },
            },
          ],
          {cancelable: false},
        );
        dispatch({type: 'EMAIL_RESET_FAIL'});
        setLoading(false);
      });
  } else {
    console.log('Email failed validation');
    setLoading(false);
  }
}

function setIsReset(dispatch: any, isReset: boolean) {
  dispatch({type: 'SET_IS_RESET', isReset});
}
