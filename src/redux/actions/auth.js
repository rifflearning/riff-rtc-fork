import { CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  INPUT_STATE_CHANGE,
  CLEAR_ERROR} from '../constants/ActionTypes';
import app from "../../firebase"
import { push } from 'react-router-redux'

  export const createUserSuccess = (resp) => {
    console.log("create user success...", resp)
    let user  = {
      email: resp.user.email,
      uid: resp.user.uid,
      verified: resp.user.emailVerified
    }
    return {
      type: CREATE_USER_SUCCESS,
      user: user,
    }
  }

  export const createUserFail = (error) => {
    return {
      type: CREATE_USER_FAIL,
      error
    }
  }

  export const changeInputState = (email, password) => {
    return {
      type: INPUT_STATE_CHANGE,
      email: email,
      password: password
    }
  }

  export const clearAuthError = () => {
    return {
      type: CLEAR_ERROR
    }
  }

  export const changePasswordState = (pass) => {
    return changeInputState(null, pass);
  }

  export const changeEmailState = (email) => {
    return changeInputState(email, null);
  }

  export const attemptUserCreate = (email, pass) => dispatch => {
    app.auth().createUserWithEmailAndPassword(email, pass)
    .then((resp) => {
      dispatch(createUserSuccess(resp));
    }).then(() => {
      console.log("pushing home...")
      dispatch(push("/home"))
    })
    .catch((error) => dispatch(createUserFail(error)));
  }

  //
  // module.exports = {
  //
  //   // called at app start
  //   startListeningToAuth: function(){
  //     return function(dispatch,getState){
  //       fireRef.onAuth(function(authData){
  //         if (authData){
  //           dispatch({
  //             type: C.LOGIN_USER,
  //             uid: authData.uid,
  //             username: authData.github.displayName || authData.github.username
  //           });
  //         } else {
  //           if (getState().auth.currently !== C.ANONYMOUS){ // log out if not already logged out
  //             dispatch({type:C.LOGOUT});
  //           }
  //         }
  //       });
  //     }
  //   },
  //   attemptLogin: function(){
  //     return function(dispatch,getState){
  //       dispatch({type:C.ATTEMPTING_LOGIN});
  //       fireRef.authWithOAuthPopup("github", function(error, authData) {
  //         if (error) {
  //           dispatch({type:C.DISPLAY_ERROR,error:"Login failed! "+error});
  //           dispatch({type:C.LOGOUT});
  //         } else {
  //           // no need to do anything here, startListeningToAuth have already made sure that we update on changes
  //         }
  //       });
  //     };
  //   },
  //   logoutUser: function(){
  //     return function(dispatch,getState){
  //       dispatch({type:C.LOGOUT}); // don't really need to do this, but nice to get immediate feedback
  //       fireRef.unauth();
  //     };
  //   }
  // };
