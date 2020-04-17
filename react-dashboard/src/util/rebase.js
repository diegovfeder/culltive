import Rebase from "re-base";
import firebase from "firebase/app";
import "firebase/firestore";

var app = firebase.initializeApp({
  apiKey: "AIzaSyBFYUS6xrakFFmJOb6gZfpOb1nG-qGLAiE",
  authDomain: "culltive.firebaseapp.com",
  databaseURL: "https://culltive.firebaseio.com",
  projectId: "culltive",
  messagingSenderId: "789397156548"
});

var db = firebase.firestore(app);
var base = Rebase.createClass(db);

export default base;
