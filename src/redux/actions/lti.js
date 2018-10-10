import { LTI_LOGIN_USER,
         LTI_LOGOUT_USER,
       } from '../constants/ActionTypes';
import {push} from 'connected-react-router';
import {attemptUserCreate, attemptUserSignIn, loginUserSuccess, createUserFail} from './auth';
import {changeRoomNameState, joinRoom} from './makeMeeting';
import {changeDisplayName} from './chat';
import app from '../../firebase';


export const loginLTIUser = ltiData => dispatch => {
  let ltiState =
    {
      user:
      {
        id:       ltiData.user.id,
        email:    ltiData.user.email,
        fullName: ltiData.user.name.full,
        group:    ltiData.group,
      },
      context:
      {
        id:              ltiData.context.id,
        title:           ltiData.context.title,
        label:           ltiData.context.label,
        courseSectionId: ltiData.context.course_section_id
      },
    };

  let ltiUserEmail = "LTI_" + ltiState.user.email;
  let ltiUserPass =  "LTIPASS_" + ltiState.user.id;
  let ltiRoomName = ltiState.context.id + "_" + ltiState.user.group;
  console.log("Logging in user through LTI...");

  app.auth().signInWithEmailAndPassword(ltiUserEmail, ltiUserPass)
    .catch((err) => {
      if (err.code === 'auth/user-not-found') {
        console.log('LTI user first login, creating account...');
        return app.auth().createUserWithEmailAndPassword(ltiUserEmail, ltiUserPass);
      }

      // Can't handle this error, pass it to the next error handler (catch)
      //console.error(`LTI user (${ltiUserEmail}) login failed with code: ${err.code}`);
      throw err;
    })
    .then((resp) => {
      // We've either signed in or created a new account and signed in
      dispatch(loginUserSuccess(resp));
      dispatch({ type: LTI_LOGIN_USER, ltiState });
    })
    .catch((err) => {
      console.error(`LTI user (${ltiUserEmail}) login or create account failed with code: ${err.code}`);
    })
    .then(() => {
      dispatch(joinRoom(ltiRoomName));
      dispatch(changeDisplayName(ltiState.user.fullName));
      dispatch(push('/room'));
    });
};
