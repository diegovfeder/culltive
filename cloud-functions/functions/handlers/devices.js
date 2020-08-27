const { db } = require("../util/admin");

// GET ALL DEVICES
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

// GET DEVICE
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

// GET DEVICE ACTION
exports.getDeviceAction = (req, res) => {
  let actionData = {};
  db.doc(`/devices/${req.params.deviceId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("ERROR 404: Device not found");
        return res.status(404).json({
          error: "Device not found"
        });
      }
      actionData = doc.data().action;
      console.log('actionData: ' + JSON.stringify(actionData));
      return res.json(actionData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

// POST DEVICE
exports.postDevice = (req, res) => {
  if (req.body.deviceId.trim() === "") {
    return res.status(400).json({
      body: "You need to send a deviceId to instantiate the object on firebase..."
    });
  }

  const newDevice = {
    action: {
      ledTape: true, 
      waterPump: false,
    },
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


// POST DEVICE ACTION
exports.postDeviceAction = (req, res) => {
  var deviceRef = db.collection("devices").doc(`${req.params.deviceId}`);
  var deviceData = {};

  deviceRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", JSON.stringify(doc.data()));
        deviceData = doc.data(); 
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return res.status(404).json({
          body: "Doc does not exits"
         })
    }
  }).catch((err) => {
    console.log("Error getting document:", err);
    return res.status(500).json({
      body: err.error 
    })
  });
  
  const newAction = {
    ledTape: req.body.ledTape, 
    waterPump: req.body.waterPump,
    // updatedAt: new Date().toISOString(),
  };

  // Validate request waterPump !== null || undefined etc...
  if (typeof newAction.ledTape === 'undefined') {
    // Need to resolve, it's undefined
    newAction.ledTape = true; // true is the default value
    if (typeof deviceData.action.ledTape !== 'undefined') {
      newAction.ledTape = deviceData.action.ledTape;
    }
     
  } else if (typeof newAction.waterPump === 'undefined') {
    // Need to resolve, it's undefined
    newAction.waterPump = false; // false is the default value
    if (typeof deviceData.action.waterPump !== 'undefined') {
      newAction.waterPump = deviceData.action.waterPump;
    }
  }


  deviceRef.update({
    "action": newAction
  })
  .then(() => {
    console.log("device.action successfully updated!");
    return res.status(200).json({
     body: "Action posted to deviceId: " + req.params.deviceId,
    //  data: {...deviceData, action: newAction}
     action: newAction,
    })
  })
  .catch((err) => {
    console.log("Error updating document: ", err);
    return res.status(401).json({
      body: err.error 
     })
  });  
};


// DELETE DEVICE
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