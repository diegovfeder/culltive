const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { db } = require("./util/admin");

// const cityTimezones = require('city-timezones');

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


// Trigger function when newReading is created @ readings collection
exports.transposeReading = functions.firestore
.document('readings/{readingsId}')
.onCreate(async (snap, context) => {
  const qrCode = snap.data().qrCode;
  const air = snap.data().air;
  const lumi = snap.data().lumi;
  const soil = snap.data().soil;
  const temp = snap.data().temp;
  const ledState = snap.data().ledState;
  const waterLevel = snap.data().waterLevel;
  const waterPumpState = snap.data().waterPumpState;

  //TODO: Verify if doc exists, catch error
  await db
    .doc(`devices/${qrCode}`)
    .set({
      air,
      lumi,
      soil,
      temp,
      ledState,
      waterLevel,
      waterPumpState
    });

  console.log('transposeReading');
});

// Trigger a function on user creation
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  // TODO: Send the email...

});

// Schedule function to run every 3 hours
exports.scheduledFunction =
functions.pubsub.schedule('every 3 hours').onRun((context) => {
    console.log('This will be run every 3 hours daily')
});


//-----------------------------------------------
// Testing Firebase Cloud GEOLOCATION
//----------------------------------------------=
// Handle the response within this function. It can be extended to include more data.
function _geolocation(req, res) {
  // res.header('Cache-Control','no-cache');

  const data = {
    country: req.headers["x-appengine-country"],
    region: req.headers["x-appengine-region"],
    city: req.headers["x-appengine-city"],
    cityLatLong: req.headers["x-appengine-citylatlong"],
    userIP: req.headers["x-appengine-user-ip"],
    // cityData: cityTimezones.lookupViaCity(req.headers["x-appengine-city"])
  }

  res.json(data)
};

exports.geolocation = functions.https.onRequest(_geolocation);


// --------------------------------------------------------
//               FIREBASE RELATED... well, ofc
// --------------------------------------------------------
// -- Deploying Firebase Locally (https://firebase.google.com/docs/functions/local-emulator)
// cd functions
// set GOOGLE_APPLICATION_CREDENTIALS=.\serviceAccountKey.json
// cd ..
// firebase serve
//
// -- Javascript Email Validator Library
// npm install validator
// var validator = require('validator')
// validator.isEmail('foo@bar.com')
//
// -- Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// --------------------------------------------------------
//               THE FORGOTTHEN FUNCTIONS 
// --------------------------------------------------------
// // Options when not using the whitelist.
// const corsOptions = {
//   origin: true
// }

// // Export the cloud function.
// exports.geolocation = (req, res) => {
//   const corsHandler = cors(corsOptions);

//   return corsHandler(req, res, function() {
//     return _geolocation(req, res);
//   });
// };

// exports.geolocation = functions.https.onRequest(app);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// -- Listen for changes in all documents in the 'users' collection
// exports.userSomething = functions.firestore
//     .document('user/{userId}')
//     .onCreate((snap, context) => {
//     // Get an object representing the document
//     const newValue = snap.data();

//     // access a particular field as you would any JS property
//     const name = newValue.name;

//     // perform desired operations ...

//     });