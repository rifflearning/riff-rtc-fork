import {
  DASHBOARD_FETCH_MEETINGS
} from '../constants/ActionTypes';

const initialState = {
  numMeetings: 0,
  fetchMeetingsStatus: 'loading',
  meetings: [],
};

const dashboard = (state=initialState, action) => {
  switch(action.type) {
  case(DASHBOARD_FETCH_MEETINGS):
    return {...state, fetchMeetingsStatus: action.status,
            meetings: action.meetings ? action.meetings : state.meetings,
            numMeetings: action.meetings ? action.meetings.length : state.meetings.length};
  default:
    return state;
  }
};

export default dashboard;
