const { db } = require("../util/admin");

exports.getAllDevices = (req, res) => {
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

exports.postNewDevice = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({
      body: "Body must not be empty"
    });
  }

  const newDevice = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("devices")
    .add(newDevice)
    .then(doc => {
      const resDevice = newDevice;
      resDevice.deviceId = doc.id;
      res.json({
        resDevice
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "something went wrong"
      });
      console.error(err);
    });
};

// Fetch one device
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