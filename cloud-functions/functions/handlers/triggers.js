const functions = require("firebase-functions");
const { db } = require("../util/admin");

const fs = require('fs'); 
const path = require('path'); 
const nodemailer = require('nodemailer');


// Listen for new document created in the 'devices' collection
exports.tieDeviceToUser = functions.firestore
    .document('devices/{deviceId}')
    .onCreate(async (snap, context) => {

      // Get an object representing the document
      const newDevice = snap.data();
      var userRef = db.collection("users").doc(`${newDevice.user}`);

      // Update / Add of a specific user
      try {
        await userRef.update({
          device: `${newDevice.deviceId}`
        });
        console.log("Document successfully updated!");
      }
      catch (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      }
    });


// Listen for deleted document in the 'devices collection
exports.untieDeviceFromUser = functions.firestore
    .document('devices/{deviceId}')
    .onDelete(async (snap, context) => {
      
      // Get an object representing the document prior to deletion
      const deletedDevice = snap.data();
      var userRef = db.collection("users").doc(`${deletedDevice.user}`);

      // Update / Remove device from a specific user
      try {
        await userRef.update({
          device: ''
        });
        console.log("Document successfully updated!");
      }
      catch (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      }
    });


// Send welcome email from user signup
const welcomePath = path.join(__dirname, '../public', 'welcome.html');
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


//TODO: Finish this feature
// Listen for update in action.waterPump (false -> true) in 'devices' collection
// exports.turnOffWaterPump = functions.firestore
//     .document('devices/{deviceId}/action')
//     .onUpdate((snap, context) => {

//       // Get an object representing the document
//       const newDevice = snap.data();
//       var userRef = db.collection("users").doc(`${newDevice.user}`);

//       // Update / Add of a specific user
//       return userRef.update({
//           device: `${newDevice.deviceId}`
//       })
//       .then(() => {
//           console.log("Document successfully updated!");
//       })
//       .catch((error) => {
//           // The document probably doesn't exist.
//           console.error("Error updating document: ", error);
//       });
//     });

// Schedule function to run every 3 hours
// exports.scheduledFunction =
// functions.pubsub.schedule('every 3 hours').onRun((context) => {
//     console.log('This will be run every 3 hours daily')
// });