import { combineReducers } from 'redux'
import {
  JOIN_CHAT,
} from './actions'


const initialState = {
  inChat: false,
  roomName: ""
};

function riffApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case JOIN_CHAT:
      return Object.assign({}, state, {
          inChat: true,
          roomName: action.room
      })
    default:
      return state
  }
};

export default riffApp;
