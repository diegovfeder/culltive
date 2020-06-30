const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { db } = require("./util/admin");

const fs = require('fs'); 
const path = require('path'); 
const nodemailer = require('nodemailer');


// User routes
const {
  signup,
  signin,
  getUsers,
  getUser,
} = require("./handlers/users");

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", FBAuth, getUsers);
app.get("/user/:userId", FBAuth, getUser);


// Device routes
const {
  getDevices,
  getDevice,
  postDevice,
  deleteDevice,
} = require("./handlers/devices");

app.get("/devices", getDevices);
app.get("/device/:deviceId", getDevice);
app.post("/device", postDevice);  
app.delete("/device/:deviceId", FBAuth, deleteDevice);


// Reading sensor routes
const { getReadings, getLastReading, postReading } = require("./handlers/readings");
const { error } = require("util");

app.get("/readings", getReadings);
app.get("/reading/:deviceId", getLastReading);
app.post("/reading", postReading);


exports.api = functions.https.onRequest(app);
// baseURL = "https://us-central1-culltive.cloudfunctions.net/api";


//---------------------------------------------------------------
// TRIGGERS // SCHEDULERS // NOT API RELATED CLOUD FUNCTIONS //
//--------------------------------------------------------------

// Listen for new document created in the 'devices' collection
exports.tieDeviceToUser = functions.firestore
    .document('devices/{deviceId}')
    .onCreate((snap, context) => {

      // Get an object representing the document
      const newDevice = snap.data();
      var userRef = db.collection("users").doc(`${newDevice.user}`);

      // Update deviceId of a specific user
      return userRef.update({
          device: `${newDevice.deviceId}`
      })
      .then(function() {
          console.log("Document successfully updated!");
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    });


//TODO: Clean device from users when deleted / unpaired
// exports.tieDeviceToUser = functions.firestore
//     .document('devices/{deviceId}')
//     .onDelete((snap, context) => {
//       // Get an object representing the document prior to deletion
//       // e.g. {'name': 'Marie', 'age': 66}
//       const deletedValue = snap.data();

//       // perform desired operations ...

//     });


// Send welcome email from user signup
const welcomePath = path.join(__dirname, 'public', 'welcome.html');
var htmlmail = fs.readFileSync(welcomePath,"utf-8").toString();

const gmailEmail = "culltiveme@gmail.com";
const gmailPassword = "W_project";
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const recipent_email = user.email; 
   
  const mailOptions = {
      from: '"Culltive" <culltiveme@gmail.com>',
      to: recipent_email,
      subject: 'Bem vindo a Culltive!',
      html: htmlmail,
  };

  try {
    mailTransport.sendMail(mailOptions);
    console.log('mail sent');
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }

  return null; 
});


// Get aproximated geolocation from client IP by GCP app engine
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
// -- DEPLOY
// cd culltive/cloud-functions
// firebase deploy --only functions 
//
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


// Trigger function when newReading is created @ readings collection
// exports.transposeReading = functions.firestore
// .document('readings/{readingsId}')
// .onCreate(async (snap, context) => {
//   const deviceId = snap.data().deviceId;
//   const air = snap.data().air;
//   const lumi = snap.data().lumi;
//   const soil = snap.data().soil;
//   const temp = snap.data().temp;
//   const ledState = snap.data().ledState;
//   const waterLevel = snap.data().waterLevel;
//   const waterPumpState = snap.data().waterPumpState;

//   //TODO: Verify if doc exists, catch error
//   await db
//     .doc(`devices/${qrCode}`)
//     .set({
//       air,
//       lumi,
//       soil,
//       temp,
//       ledState,
//       waterLevel,
//       waterPumpState
//     });

//   console.log('transposeReading');
// });

// Schedule function to run every 3 hours
// exports.scheduledFunction =
// functions.pubsub.schedule('every 3 hours').onRun((context) => {
//     console.log('This will be run every 3 hours daily')
// });