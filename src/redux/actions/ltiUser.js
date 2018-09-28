import {
  LTI_INITIALIZE_USER
} from '../constants/ActionTypes';
import {push} from 'connected-react-router';
import {attemptUserCreate, attemptUserSignIn, loginUserSuccess, createUserFail} from './auth';
import {changeRoomNameState, joinRoom} from './makeMeeting';
import {changeDisplayName} from './chat';
import app from '../../firebase';


export const initializeLTIUser = ltiData => dispatch => {
  let ltiState = {
    ltiUser: true,
    isValid: true,
    group: ltiData.group,
    ltiUserId: ltiData.user.id,
    ltiUserEmail: ltiData.user.email,
    ltiUserFullName: ltiData.user.name.full,
    ltiContextId: ltiData.context.id,
    ltiContextTitle: ltiData.context.title,
    ltiContextLabel: ltiData.context.label,
    ltiCourseSectionId: ltiData.context.course_section_id
  };


  let ltiUserEmail = "LTI_" + ltiState.ltiUserEmail;
  let ltiUserPass =  "LTIPASS_" + ltiState.ltiUserId;
  let ltiGroupname = ltiState.ltiContextId + "_" + ltiState.group;
  console.log("Logging in user through LTI...");

  app.auth().createUserWithEmailAndPassword(ltiUserEmail, ltiUserPass)
    .then(() => {
      return {type: LTI_INITIALIZE_USER, ltiState};
    }).catch((err) => {
      var errorCode = err.code;
      console.log("error code:", errorCode);
      if (errorCode == 'auth/email-already-in-use') {
        console.log("Email already in use, but is an LTI user. Logging in....");
        return app.auth().signInWithEmailAndPassword(ltiUserEmail, ltiUserPass);
      }
      return false;
    }).then((resp) => {
      if (resp) {
        dispatch(loginUserSuccess(resp));
        dispatch(joinRoom(ltiGroupname));
        dispatch(changeDisplayName(ltiState.ltiUserFullName));
        dispatch(push("/room"));
      } else {
        console.log("couldn't login LTI user. ");
      }
    });

};
