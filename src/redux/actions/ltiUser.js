import {
  LTI_INITIALIZE_USER
} from '../constants/ActionTypes';

import {attemptUserCreate, attemptUserSignIn, createUserSuccess, createUserFail} from './auth';
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


  let ltiUserEmail = "LTI::" + ltiState.ltiUserEmail;
  let ltiUserPass =  ltiState.ltiUserId + ltiState.ltiFullName;

  app.auth().createUserWithEmailAndPassword(ltiUserEmail, ltiUserPass)
    .then(() => {
      return {type: LTI_INITIALIZE_USER, ltiState};
    }).catch((err) => {
      var errorCode = err.code;
      console.log("error code:", errorCode);
      if (errorCode == 'auth/email-already-in-use') {
        console.log("Email already in use, but is an LTI user. Logging in....");
        dispatch(attemptUserSignIn(ltiUserEmail, ltiUserPass));
      }
      return {type: LTI_INITIALIZE_USER, ltiState};
    });

};
