import { combineReducers } from 'redux';
import auth from './auth';
import chat from './chat';
import makeMeeting from './makeMeeting';
import riff from './riff';


export default combineReducers({
  auth,
  riff,
  chat,
  makeMeeting
});
