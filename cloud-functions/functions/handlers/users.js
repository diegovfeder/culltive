const { admin, db } = require("../util/admin");

const firebase = require("firebase");
const firebaseConfig = require("../util/firebaseConfig");
firebase.initializeApp(firebaseConfig);

const {
  validateSignupData,
  validateSigninData,
  reduceUserDetails
} = require("../util/validators");

exports.signup = (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password 
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  // FIXME: Upload a default user img and link to newUser in firestore
  // const noImg = "no-img.jpg";

  let token, userId;
  db.doc(`/users/${newUser.email}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          handle: "This handle is already taken" // FIXME: This message is breaking the code at line 45: Cannot read property 'uid' of undefined
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        name: newUser.name,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId //can do this because it is the same name of the declared variable
      };
      return db.doc(`/users/${newUser.email}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({
        token
      });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({
          email: "Email is already in use"
        });
      } else {
        return res.status(500).json({
          general: "Something went wrong, please try again"
        });
      }
    });
};
// imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,


exports.signin = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateSigninData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({
        token
      });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        return res.status(403).json({
          general: "Wrong credentials, please try again"
        });
      } else if (err.code === "auth/wrong-password") {
        return res.status(403).json({
          general: "Wrong password, please try again"
        });
      } else {
        return res.status(500).json({
          error: err.code
        });
      }
    });
};

// get all users
exports.getAllUsers = (req, res) => {
  db.collection("users")
    .get()
    .then(data => {
      let users = [];
      data.forEach(doc => {
        users.push({
          usersId: doc.id,
          ...doc.data()
        });
      });
      return res.json(users);
    })
    .catch(err => console.error(err));
};

// Fetch one user
exports.getUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.userId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "User not found"
        });
      } else {
        return res.json(doc.data());
      }
    })
    .catch(err => console.error(err));
};

// Get own user Details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data.recipient,
          sender: doc.data.sender,
          read: doc.data.read,
          screamId: doc.data.screamId,
          type: doc.data.type,
          createdAt: doc.data.createdAt,
          notificationId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({
        error: err.code
      });
    });
};

// Add userDetails
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({
        message: `Details added successfully`
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("screams")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({
          error: "User not found"
        });
      }
    })
    .then(data => {
      userData.screams = [];
      data.forEach(doc => {
        userData.screams.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, {
      read: true
    });
  });
  batch
    .commit()
    .then(() => {
      return res.json({
        message: "Notifications marked read"
      });
    })
    .catch(err => {
      constole.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};

// Upload a profile image for user
exports.uploadImage = (req, res) => {
  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new Busboy({
    headers: req.headers
  });

  let imageFileName;
  let imageToBeUploaded = {};

  // TODO: File too long validation - PayloadTooLargeError: request entity too large

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    // console.log(fieldname)
    // console.log(filename)
    // console.log(mimetype)
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({
        error: "Wrong file type submitted"
      });
    }

    // my.image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 1429419824891.png
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({
          imageUrl
        });
      })
      .then(() => {
        return res.json({
          message: "Image uploaded successfully"
        });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({
          error: err.code
        });
      });
  });
  busboy.end(req.rawBody);
};

//FIXME: Old codes
// separate value of the url request:userId
// let userId = req.url.split("/");
// userId = userId[userId.length - 1];
