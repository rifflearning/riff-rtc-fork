import {
  CHAT_SET_WEBRTC_CONFIG,
  JOIN_ROOM,
  JOINED_ROOM,
  JOINING_ROOM,
  IN_ROOM,
  MUTE_AUDIO,
  MUTE_VIDEO,
  ADD_PEER,
  REMOVE_PEER,
  READY_TO_CALL
} from '../constants/ActionTypes';

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
  },
  webRtcPeers: [],
  readyToCall: false,
  webRtc: {
    config: null,
    signalMasterPath: ''
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
  case(CHAT_SET_WEBRTC_CONFIG):
    return {...state, webRtc: {config: action.webRtcConfig,
                               signalMasterPath: action.signalMasterPath}};
  case(ADD_PEER):
    return {...state, webRtcPeers: [...state.webRtcPeers, action.peer]};
  case(REMOVE_PEER):
    const index = state.webRtcPeers.map(item => item.id).indexOf(action.peer.id);
    return {...state, webRtcPeers: [...state.webRtcPeers.slice(0, index),
                                    ...state.webRtcPeers.slice(index + 1)]};
  case(READY_TO_CALL):
    return {...state, readyToCall: true};
  case(JOINED_ROOM):
    return{...state, inRoom: true};
  default:
    return state;
  }
};

export default chat;
