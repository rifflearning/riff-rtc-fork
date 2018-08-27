import {
  DASHBOARD_UPDATE_MEETING_LIST,
  DASHBOARD_FETCH_MEETINGS
} from '../constants/ActionTypes';

import { app, socket} from "../../riff";

export const updateMeetingList = (meetings) => {
  return {type: DASHBOARD_FETCH_MEETINGS,
          status: 'loaded',
          meetings: meetings};
};

export const loadRecentMeetings = (uid) => dispatch => {
  dispatch({type: DASHBOARD_FETCH_MEETINGS, status: 'loading'});
  return app.service('participants').find({query: {_id: uid}}).then((res) => {
    console.log(">>fetched participant:", res);
    return res.data[0];
  }).then((participant) => {
    return participant.meetings;
  }).then((meetingIds) => {
    return app.service('meetings').find({query: {_id: meetingIds}});
  }).then((meetingObjects) => {
    dispatch(updateMeetingList(meetingObjects));
    console.log("got meeting objects:", meetingObjects);
  }).catch((err) => {
    console.log("Couldn't retrieve meetings", err);
  });
};
