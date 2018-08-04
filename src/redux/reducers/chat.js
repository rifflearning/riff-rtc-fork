import {
  JOIN_ROOM,
  JOINING_ROOM,
  IN_ROOM,
  MUTE_AUDIO,
  MUTE_VIDEO,
} from '../constants/ActionTypes'

const initialState = {
  joiningRoom: false,
  testAudioState: null,
  testVideoState: null,
  inRoom: false,
  roomName: null,
  audioMuted: false,
  videoMuted: false,
  rhythm: {
    authenticated: false,
    token: null,
    error: null
  }
}

// Note that a risk here is that room state is persisted when a user closes a
// window. this could cause some weird behavior, let's remember that.
const chat = (state = initialState, action) => {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
  case(JOIN_ROOM):
    return {...state, joiningRoom: true, roomName: action.roomName};
  default:
    return state
  }
};

export default chat;
