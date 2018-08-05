import {
  JOIN_CHAT
} from '../constants/ActionTypes'


const chat = (state = {}, action) => {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case(JOIN_CHAT):
      return {...state, inChat: true, roomName: action.room}
    default:
      return state
  }
};

export default chat;
