import { combineReducers } from 'redux';
import auth from './auth';
import chat from './chat';

const initialState = {
  inChat: false,
  roomName: ""
};

export default combineReducers({
  auth,
  chat
});
