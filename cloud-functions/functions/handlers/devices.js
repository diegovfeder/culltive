const { db } = require("../util/admin");

exports.getDevices = (req, res) => {
  db.collection("devices")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let devices = [];
      data.forEach(doc => {
        devices.push({
          deviceId: doc.id,
          ...doc.data()
          //this is called spread operator - works in node 8
        });
      });
      return res.json(devices);
    })
    .catch(err => console.error(err));
};


exports.getDevice = (req, res) => {
  let deviceData = {};
  db.doc(`/devices/${req.params.deviceId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Device not found"
        });
      }
      deviceData = doc.data();
      deviceData.deviceId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("deviceId", "==", req.params.deviceId)
        .get();
    })
    .then(data => {
      deviceData.comments = [];
      data.forEach(doc => {
        deviceData.comments.push(doc.data());
      });
      return res.json(deviceData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

exports.postDevice = (req, res) => {
  if (req.body.user.trim() === "") {
    return res.status(400).json({
      body: "User must exist to be assigned"
    });
  }

  const newDevice = {
    user: req.body.user, // TODO: This user received from esp8266 should be tested
    geolocation: req.body.geolocation,
    productType: req.body.productType,
    qrCode: req.body.qrCode, 
    version: req.body.version,
    wifiSSID: req.body.wifiSSID,
    wifiPassword: req.body.wifiPassword,
    wifiStatus: req.body.wifiStatus,
    createdAt: new Date().toISOString(),
  };

  db.doc(`/devices/${newDevice.qrCode}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          body: "This device is already created / paired."
        });
      } else {
        return db.doc(`/devices/${newDevice.qrCode}`).set(newDevice);
       }
    })
    .then(() => {
      return res.status(201).json({
        body: 'Device ' + newDevice.qrCode + ' created successfully'
      });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/device-already-created") {
        return res.status(400).json({
          device: "Device Id / QR Code is already in use"
        });
      } else {
        return res.status(500).json({
          general: "Something went wrong, please try again"
        });
      }
    });


  //FIXME: Old cold... chanong to above one
  // db.collection("devices")
  //   .add(newDevice)
  //   .then(doc => {
  //     const resDevice = newDevice;
  //     resDevice.deviceId = doc.id;
  //     return res.json({
  //       resDevice
  //     });
  //   })
  //   .catch(err => {
  //     return res.status(500).json({
  //       error: "something went wrong"
  //     });
  //     console.error(err);
  //   });
};

// Delete a device
// exports.deleteDevice = (req, res) => {
//   const document = db.doc(`/devices/${req.params.deviceId}`)
//   document.get()
//     .then(doc => {
//       if (!doc.exists) {
//         return res.status(404).json({
//           error: 'Device not found'
//         })
//       }
//       if (doc.data().userHandle !== req.user.handle) {
//         return res.status(403).json({
//           error: 'Unauthorized'
//         })
//       } else {
//         return document.delete()
//       }
//     })
//     .then(() => {
//       res.json({
//         message: 'Device deleted successfully'
//       })
//     })
//     .catch(err => {
//       console.error(err)
//       return res.status(500).json({
//         error: err.code
//       })
//     })
// }
