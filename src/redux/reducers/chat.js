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
  CHAT_READY_TO_CALL,
  CHAT_SHARE_STREAM,
  CHAT_VOLUME_CHANGED
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
  volume: 0,
  stream: null,
  webRtcPeers: [],
  readyToCall: false,
  webRtc: {
    config: null,
    signalMasterPath: ''
  }
};

// Note that a risk here is that room state is persisted when a user closes a
// window. this could cause some weird behavior, let's remember that.
const chat = (state = initialState, action) => {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
  case(JOIN_ROOM):
    return {...state, joiningRoom: true, roomName: action.roomName, inRoom: false};
  case(CHAT_SET_WEBRTC_CONFIG):
    return {...state, webRtc: {config: action.webRtcConfig,
                               signalMasterPath: action.signalMasterPath}};
  case(ADD_PEER):
    // this removes any null peers
    const peers = state.webRtcPeers.filter(n => !(n === null));
    return {...state, webRtcPeers: [...peers, action.peer]};
  case(REMOVE_PEER):
    const index = state.webRtcPeers.map(item => item.id).indexOf(action.peer.id);
    return {...state, webRtcPeers: [...state.webRtcPeers.slice(0, index),
                                    ...state.webRtcPeers.slice(index + 1)]};
  case(CHAT_SHARE_STREAM):
    console.log("stream:", action.stream);
    return {...state, stream: action.stream};
  case(CHAT_READY_TO_CALL):
    return {...state, readyToCall: true};
  case(JOINED_ROOM):
    return{...state, inRoom: true};
  case(CHAT_VOLUME_CHANGED):
    return {...state, volume: action.volume};
  default:
    return state;
  }
};

export default chat;
