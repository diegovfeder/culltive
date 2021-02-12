const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());


// TODO:
// BASE URL ENDPOINT WILL RETURN OUR API DOCS
const getApiDocs = (req, res) => {
  return res.status(200).json({docs: "return a html rendered docs"});
}
app.get("/", getApiDocs)

// Acts
const { getActs, getRecentActs, getAct, postAct } = require("./handlers/acts");

app.get("/acts", getActs);
app.get("/act/:actId", getRecentActs);
// app.get("/act/:actId", getAct);
app.post("/act", postAct);


// Device routes
const {
  getDevices,
  getDevice,
  getDeviceAction,
  postDevice,
  postDeviceAction,
  deleteDevice,
} = require("./handlers/devices");

app.get("/devices", getDevices);
app.get("/device/:deviceId", getDevice);
app.get("/device/:deviceId/action", getDeviceAction);
app.post("/device", postDevice);  
app.post("/device/:deviceId/action", postDeviceAction); 
app.delete("/device/:deviceId", FBAuth, deleteDevice);  

// User routes
const {
  signup,
  signin,
  getUsers,
  getAuthenticatedUser,
  getUser,
} = require("./handlers/users");

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", FBAuth, getUsers);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:userId", FBAuth, getUser);



// Readings routes
const { getReadings, getLastReading, postReading } = require("./handlers/readings");

app.get("/readings", getReadings);
app.get("/reading/:deviceId", getLastReading);
app.post("/reading", postReading);



// Exports api as a group
// baseURL = "https://us-central1-culltive.cloudfunctions.net/api";
exports.api = functions.https.onRequest(app);


// Triggers
exports.triggers = require('./handlers/triggers');


// --------------------------------------------------------
//               THE FORGOTTHEN FUNCTIONS 
// --------------------------------------------------------

// // Options when not using the whitelist.
// const corsOptions = {
//   origin: true
// }

// // Geolocation with cors
// exports.geolocation = (req, res) => {
//   const corsHandler = cors(corsOptions);
//   return corsHandler(req, res, function() {
//     return _geolocation(req, res);
//   });
// };
// exports.geolocation = functions.https.onRequest(app);