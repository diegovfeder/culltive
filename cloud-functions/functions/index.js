const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { db } = require("./util/admin");

// baseURL = "https://us-central1-culltive.cloudfunctions.net/api";

// TODO: Create firebase functions calls for Hours / Days / Week readings
// organizing data for UI

// Readings routes
const { getAllReadings, postNewReading } = require("./handlers/readings");

app.get("/readings", getAllReadings);
app.post("/reading", postNewReading);

// User routes
const {
  signup,
  signin,
  getAllUsers,
  getUser

  // uploadImage,
  // addUserDetails,
  // getAuthenticatedUser,
  // markNotificationsRead
} = require("./handlers/users");

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", getAllUsers);
app.get("/user/:userId", getUser);
// app.post("/user/image", FBAuth, uploadImage);
// app.post("/user", FBAuth, addUserDetails);
// app.get("/user", FBAuth, getAuthenticatedUser);
// app.get("/user/:handle", getUserDetails);
// app.post("/notifications", FBAuth, markNotificationsRead);

// Device routes
const {
  getDevices,
  getDevice,
  postDevice,

  // deleteDevice,
} = require("./handlers/devices");

app.get("/devices", getDevices);
app.get("/device/:deviceId", getDevice);
app.post("/device", postDevice);
// app.delete("/device/:deviceId", FBAuth, deleteDevice);

// exports the above api to firebase cloud functions @ https://baseurl.com/api/
exports.api = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Deploying Firebase Locally (https://firebase.google.com/docs/functions/local-emulator)
// cd functions
// set GOOGLE_APPLICATION_CREDENTIALS=.\serviceAccountKey.json
// cd ..
// firebase serve
//
// // Javascript Email Validator Library
// npm install validator
// var validator = require('validator')
// validator.isEmail('foo@bar.com')
