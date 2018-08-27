import {
  RIFF_AUTHENTICATE_SUCCESS,
  RIFF_AUTHENTICATE_FAIL,
  RIFF_PARTICIPANTS_CHANGED,
  RIFF_TURN_UPDATE,
  RIFF_JOIN_ROOM,
  RIFF_MEETING_ID_UPDATE
} from '../constants/ActionTypes';

import { app, socket} from "../../riff";

export const loadRecentMeetings = (uid) => dispatch => {
  return app.service('participants').find({_id: uid}).then((res) => {
    console.log(">>fetched participant:", res);
    return res;
  }).catch((err) => {
    console.log("Couldn't retrieve meetings", err);
  });
};
