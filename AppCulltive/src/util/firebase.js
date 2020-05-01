import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyASeOQWtxIbZm_ncxYGBYBVydbiDaNzAtE',
  authDomain: 'culltive.firebaseapp.com',
  databaseURL: 'https://culltive.firebaseio.com',
  projectId: 'culltive',
  storageBucket: 'culltive.appspot.com',
  messagingSenderId: '789397156548',
  appId: '1:789397156548:web:29e2ea338c6cf589180f91',
  measurementId: 'G-MNW1MD32KM',
};

firebase.initializeApp(config);

const fb = {
  auth: firebase.auth(),
};

export default fb;
