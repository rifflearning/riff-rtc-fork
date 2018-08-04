import { combineReducers } from 'redux';
import auth from './auth';
import chat from './chat';
import makeMeeting from './makeMeeting';

const initialState = {
  inChat: false,
  roomName: ""
};

export default combineReducers({
  auth,
  chat,
  makeMeeting
});
