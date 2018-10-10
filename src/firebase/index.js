import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = window.client_config.firebase;
const app = firebase.initializeApp(config);

// The following (we aren't yet storing Date objects, so there are no ramifications)
// is needed to address the following warning from Firebase:
//   [2018-10-09T19:48:08.741Z]  @firebase/firestore: Firestore (5.5.0):
//   The behavior for Date objects stored in Firestore is going to change
//   AND YOUR APP MAY BREAK.
const firestore = app.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

export default app;
