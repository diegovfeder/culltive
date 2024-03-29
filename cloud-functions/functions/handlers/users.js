const { admin, db } = require("../util/admin");

const firebase = require("firebase");
const firebaseConfig = require("../util/firebaseConfig");
firebase.initializeApp(firebaseConfig);

const {
  validateSignupData,
  validateSigninData,
} = require("../util/validators");

// Sign up user
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
          error: "This handle is already taken" 
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
        userId,
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

// Sign in user
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
        return res.status(404).json({
          general: "Wrong credentials, please try again"
        });
      } else if (err.code === "auth/wrong-password") {
        return res.status(401).json({
          general: "Wrong password, please try again"
        });
      } else {
        return res.status(500).json({
          error: err.code
        });
      }
    });
};

// Get all users 
// TODO: add query and pagination
exports.getUsers = (req, res) => {
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

// Fetch user by auth token
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  console.log('user: ' + req.user.email)
  db.doc(`/users/${req.user.email}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return res.json(userData);
      } else {
        return res.status(404).json({
          error: "User not found ???" 
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  }

// Fetch an user by id (e-mail)
exports.getUser = (req, res) => {
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