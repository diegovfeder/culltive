const { db } = require("../util/admin");

exports.getAllReadings = (req, res) => {
  db.collection("readings")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let readings = [];
      data.forEach(doc => {
        readings.push({
          readingsId: doc.id,
          ...doc.data()
          //this is called spread operator - works in node 8
        });
      });
      return res.json(readings);
    })
    .catch(err => console.error(err));
};

exports.postNewReading = (req, res) => {
  if (req.body.qrCode.trim() === "") {
    return res.status(400).json({
      body: "qrCode must not be empty"
    });
  }

  const newReading = {
    qrCode: req.body.qrCode,
    createdAt: new Date().toISOString(),
    // geolocation: "",
    air: req.body.air,
    lumi: req.body.lumi,
    soil: req.body.soil,
    temp: req.body.temp,
    ledState: req.body.ledState,
    waterLevel: req.body.waterLevel
  };

  db.collection("readings")
    .add(newReading)
    .then(doc => {
      const resReading = newReading;
      resReading.readingsId = doc.id;
      res.json({
        resReading
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "Something went wrong"
      });
      console.error(err);
    });
};

// Fetch one device
// exports.getDevice = (req, res) => {
//   let deviceData = {};
//   db.doc(`/devices/${req.params.deviceId}`)
//     .get()
//     .then(doc => {
//       if (!doc.exists) {
//         return res.status(404).json({
//           error: "Device not found"
//         });
//       }
//       deviceData = doc.data();
//       deviceData.deviceId = doc.id;
//       return db
//         .collection("comments")
//         .orderBy("createdAt", "desc")
//         .where("deviceId", "==", req.params.deviceId)
//         .get();
//     })
//     .then(data => {
//       deviceData.comments = [];
//       data.forEach(doc => {
//         deviceData.comments.push(doc.data());
//       });
//       return res.json(deviceData);
//     })
//     .catch(err => {
//       console.error(err);
//       return res.status(500).json({
//         error: err.code
//       });
//     });
// };
