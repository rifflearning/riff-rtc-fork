import app from '../../firebase';
import { loginAnonymously, createUserSuccess } from '../actions/auth.js';


export default function (dispatch, authState) {

  app.auth().onAuthStateChanged((user) => {
    console.log("Auth state changed.", user);
    if (user === null) {
      app.auth().signInAnonymously();
    } else {
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      if (user.isAnonymous) {
        console.log("user is anonymous!", user.uid);
        dispatch(loginAnonymously(uid));
      } else {
        console.log("Have a user", user);
        dispatch(createUserSuccess({user}));
      }
    }
  });
}

