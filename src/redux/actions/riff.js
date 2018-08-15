import {
  RIFF_AUTHENTICATE_SUCCESS,
  RIFF_AUTHENTICATE_FAIL
} from '../constants/ActionTypes';

import app from "../../riff";

export const riffAuthSuccess = (token) => {
  return {type: RIFF_AUTHENTICATE_SUCCESS,
          token: token};
};

export const riffAuthFail = (err) => {
  return {type: RIFF_AUTHENTICATE_FAIL,
          error: err};
};

export const attemptRiffAuthenticate = () => dispatch => {
  console.log("dataserver creds:", window.client_config.dataServer)
  app.authenticate({
    strategy: 'local',
    email: window.client_config.dataServer.email,
    password: window.client_config.dataServer.password,
  }).then(function (result) {
    console.log("auth result!: ", result);
    dispatch(riffAuthSuccess(result.accessToken));
    //return this.recordMeetingJoin();
  }.bind(this)).catch(function (err) {
    console.log('auth ERROR:', err);
    dispatch(riffAuthFail(err));
  });
  // we used to automatically join a meeting.
  // .then(function (result) {
  //     log('meeting result:', result);
  //     // we've confirmed auth & meeting join- start communication w/ server
  //     this.record();
  // }.bind(this));
}


