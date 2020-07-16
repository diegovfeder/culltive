# Firebase SDK for Cloud Functions

The `firebase-functions` package provides an SDK for defining Cloud Functions for Firebase.

Cloud Functions is a hosted, private, and scalable Node.js environment where you can run JavaScript code. The Firebase SDK for Cloud Functions integrates the Firebase platform by letting you write code that responds to events and invokes functionality exposed by other Firebase features.

## Learn more

Learn more about the Firebase SDK for Cloud Functions in the [Firebase documentation](https://firebase.google.com/docs/functions/) or [check out some samples](https://github.com/firebase/functions-samples).

Here are some resources to get help:

- Start with the quickstart: https://firebase.google.com/docs/functions/write-firebase-functions
- Create and Deploy Your First Cloud Functions: https://firebase.google.com/docs/functions/write-firebase-functions
- Go through the guide: https://firebase.google.com/docs/functions/
- Read the full API reference: https://firebase.google.com/docs/reference/functions/
- Browse some examples: https://github.com/firebase/functions-samples

If the official documentation doesn't help, try asking through firebase official support channels: https://firebase.google.com/support/


## How to deploy

cd culltive/cloud-functions
firebase deploy --only functions 

## How to serve 

Deploying Firebase Locally (https://firebase.google.com/docs/functions/local-emulator)

cd functions
set GOOGLE_APPLICATION_CREDENTIALS=.\serviceAccountKey.json
cd ..
firebase serve