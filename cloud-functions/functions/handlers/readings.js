const { db } = require("../util/admin");

exports.getReadings = (req, res) => {
  db.collection("readings")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let readings = [];
      data.forEach(doc => {
        readings.push({
          readingsId: doc.id,
          ...doc.data()
        });
      });
      return res.json(readings);
    })
    .catch(err => console.error(err));
};

exports.getLastReading = (req, res) => {

  if (req.params.deviceId.trim() === "") {
    return res.status(400).json({
      body: "You need to send an deviceId to query its latest reading."
    });
  }

  console.log("req.params.deviceId: " + req.params.deviceId);
  let reading = [];

  db.collection("readings")
    .where("deviceId", "==", req.params.deviceId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then((data) => {
      data.forEach(doc => {
      reading.push({
        deviceId: doc.id,
        ...doc.data()
      });
    });
    return res.json(reading);
  })
  .catch(err => console.error(err));
  
};


exports.postReading = (req, res) => {
  if (req.body.deviceId.trim() === "") {
    return res.status(400).json({
      body: "You need to send an deviceId to instantiate the object on firebase..."
    });
  }

  const newReading = {
    createdAt: new Date().toISOString(),
    deviceId: req.body.deviceId,
    air: req.body.air, // TODO: This user received from esp8266 should be tested
    lumi1: req.body.lumi1,
    lumi2: req.body.lumi2,
    soil1: req.body.soil1,
    soil2: req.body.soil2,
    temp: req.body.temp, 
    ledTape: req.body.ledTape,
    waterLevel: req.body.waterLevel,
    // waterPump: req.body.waterPump,
  };

  db.doc(`/readings/${newReading.deviceId}:${newReading.createdAt}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          body: "This reading already exists."
        });
      } else {
        return  db.doc(`/readings/${newReading.deviceId}:${newReading.createdAt}`).set(newReading);
       }
    })
    .then(() => {
      return res.status(201).json({
        body: 'Reading ' + newReading.deviceId + ':' + newReading.createdAt +' created successfully'
      });
    })
    .catch(err => { 
      console.error(err);
      if (err.code === "auth/reading-already-created") {
        return res.status(400).json({
          device: "Reading id is already in use"
        });
      } else {
        return res.status(500).json({
          general: "Something went wrong, please try again"
        });
      }
    })
  }