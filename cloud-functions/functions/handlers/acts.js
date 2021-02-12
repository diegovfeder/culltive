const { db } = require("../util/admin");

// GET ALL ACTS
exports.getActs = (req, res) => {
  db.collection("acts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let acts = [];
      data.forEach(doc => {
        acts.push({
          actId: doc.id,
          ...doc.data()
        });
      });
      return res.json(acts);
    })
    .catch(err => console.error(err));
};

// GET RECENT ACTS
exports.getRecentActs = (req, res) => {

  if (req.params.actId.trim() === "") {
    return res.status(400).json({
      body: "You need to send an actId to query its recent acts"
    });
  }

  let actData = {};
  db.doc(`/acts/${req.params.actId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Act not found"
        });
      }
      //TODO: Find the latest 5-10 actions, return its data
      actData = doc.data();
      console.log('actData: ' + JSON.stringify(actData));
      return res.json(actData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};


// GET ACT
exports.getAct = (req, res) => {
  let actData = {};
  db.doc(`/acts/${req.params.actId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Act not found"
        });
      }
      actData = doc.data();
      console.log('actData: ' + JSON.stringify(actData));
      return res.json(actData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

// POST ACT
exports.postAct = (req, res) => {
  if (req.body.deviceId.trim() === "") {
    return res.status(400).json({
      body: "You need to send a deviceId to instantiate a new act on firebase"
    });
  }

  const newAct = {
    createdAt: new Date().toISOString(),
    deviceId: req.body.deviceId,
    triggeredBy: req.body.triggeredBy,
    text: req.body.text,
    type: req.body.type,
    user: req.body.user,
  };
  const actId = `${newAct.deviceId}:${newAct.type}:${newAct.createdAt}`

  db.doc(`/acts/${actId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          body: "Act already exists"
        });
      } else {
        return db.doc(`/acts/${actId}`).set(newAct);
      }
    })
    .then(() => {
      return res.status(201).json({
        body: 'Act ' + actId + ' created successfully'
      });
    })
    .catch(err => { 
      console.error(err);
      return res.status(500).json({
        general: "Something went wrong, please try again"
      });
    });
};