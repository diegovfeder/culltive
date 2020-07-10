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
      console.log('deviceData: ' + JSON.stringify(deviceData));
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
      body: "You need to send an user to instantiate the object on firebase..."
    });
  }

  const newDevice = {
    deviceId: req.body.deviceId, 
    user: req.body.user,
    geolocation: req.body.geolocation,
    productType: req.body.productType,
    firmwareVersion: req.body.firmwareVersion,
    createdAt: new Date().toISOString(),
  };

  db.doc(`/devices/${newDevice.deviceId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          body: "This device is already created / paired."
        });
      } else {
        return db.doc(`/devices/${newDevice.deviceId}`).set(newDevice);
       }
    })
    .then(() => {
      return res.status(201).json({
        body: 'Device ' + newDevice.deviceId + ' created successfully'
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
};

exports.deleteDevice = (req, res) => {
  const document = db.doc(`/devices/${req.params.deviceId}`)
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({error: 'Device not found'})
      }
      if (doc.data().user !== req.user.email) {
        return res.status(403).json({error: 'Unauthorized'})
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({message: 'Device deleted successfully'})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: err.code})
    })
};