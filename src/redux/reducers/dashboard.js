import {
  DASHBOARD_FETCH_MEETINGS
} from '../constants/ActionTypes';

const initialState = {
  numMeetings: 0,
  fetchMeetingsStatus: 'loading',
  meetings: [],
  lastFetched: new Date('January 1, 2000 00:01:00'),
  shouldFetch: false,
  numMeetings: 0
};

const dashboard = (state=initialState, action) => {
  switch(action.type) {
  case(DASHBOARD_FETCH_MEETINGS):
    console.log("time diff:", (((new Date()).getTime() - new Date(state.lastFetched).getTime())/1000) > 5)
    return {...state, fetchMeetingsStatus: action.status,
            meetings: action.meetings ? action.meetings : state.meetings,
            numMeetings: action.meetings ? action.meetings.length : state.meetings.length,
            lastFetched: new Date(),
            shouldFetch: (((new Date()).getTime() - new Date(state.lastFetched).getTime())/(1000) > 5*60)};
  default:
    return state;
  }
};

export default dashboard;
