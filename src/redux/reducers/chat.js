import {
  CHAT_SET_WEBRTC_CONFIG,
  CHAT_WEBRTC_ID_CHANGE,
  JOIN_ROOM,
  JOINED_ROOM,
  JOINING_ROOM,
  IN_ROOM,
  MUTE_AUDIO,
  UNMUTE_AUDIO,
  MUTE_VIDEO,
  ADD_PEER,
  REMOVE_PEER,
  CHAT_DISPLAY_NAME_CHANGE,
  CHAT_LEAVE_ROOM,
  CHAT_READY_TO_CALL,
  CHAT_VOLUME_CHANGED,
  CHAT_GET_MEDIA_ERROR,
  CHAT_CHANGE_ROOM_NAME,
  CHAT_CHANGE_DISPLAY_NAME,
  CHAT_CHANGE_PEER_DISPLAY_NAME,
  CHAT_JOIN_ROOM_ERROR,
  CHAT_CLEAR_JOIN_ROOM_ERROR,
  CHAT_CHANGE_PEER_RIFF_ID,
  TEXT_CHAT_SEND_MSG,
  TEXT_CHAT_MSG_UPDATE
} from '../constants/ActionTypes';

const initialState = {
  peerColors: ['#f56b6b', '#128EAD', '#7caf5f', '#f2a466'],
  joiningRoom: false,
  getMediaError: true,
  inRoom: false,
  roomName: '',
  audioMuted: false,
  videoMuted: false,
  displayName: '',
  joinRoomError: null,
  savedDisplayName: false,
  savedDisplayMessage: '',
  rhythm: {
    authenticated: false,
    token: null,
    error: null
  },
  volume: 0,
  webRtcId: '',
  webRtcRoom: '',
  webRtcPeers: [],
  webRtcPeerDisplayNames: [],
  webRtcRiffIds: [],
  readyToCall: false,
  webRtc: {
    config: null,
    signalMasterPath: ''
  },
  textchat: {
    messages: [],
    badge: 0
  }
};

const chat = (state = initialState, action) => {
  switch (action.type) {
  case(JOIN_ROOM):
    return {...state, joiningRoom: true, webRtcRoom: action.roomName, inRoom: false};
  case(CHAT_CHANGE_ROOM_NAME):
    return {...state, roomName: action.roomName};
  case(CHAT_CHANGE_DISPLAY_NAME):
    return {...state, displayName: action.displayName};
  case(CHAT_SET_WEBRTC_CONFIG):
    return {...state, webRtc: {config: action.webRtcConfig,
                               signalMasterPath: action.signalMasterPath}};
  case(ADD_PEER):
      // this removes any null peers
    console.log('adding peer', action);
    let [riffId, displayName] = action.peer.peer.nick.split(' ');
    console.log('adding peer', riffId, displayName);
    const peers = state.webRtcPeers.filter(n => !(n === null));
    let peer_ids = state.webRtcPeers.map(p => p.id);
    if (peer_ids.indexOf(action.peer.id) >= 1) {
      console.log('not re-adding a peer...');
      return state;
    } else {
      let allPeers = [...peers, action.peer.peer];
      let displayNames = allPeers.map((p) => { return p.nick.split(' ')[1]});
      let riffIds = allPeers.map((p) => { return p.nick.split(' ')[0]});
      return {...state,
              webRtcPeers: allPeers,
              webRtcPeerDisplayNames: displayNames,
              webRtcRiffIds: riffIds
             };
    }
  case(REMOVE_PEER):
    let peer = action.peer.peer;
    const index = state.webRtcPeers.map(item => item.id).indexOf(peer.id);
    let allPeers = [...state.webRtcPeers.slice(0, index),
                    ...state.webRtcPeers.slice(index + 1)];
    let displayNames = allPeers.map((p) => { return p.nick.split(' ')[1]; });
    let riffIds = allPeers.map((p) => { return p.nick.split(' ')[0]; });
    return {...state,
            webRtcPeers: allPeers,
            webRtcPeerDisplayNames: displayNames,
            webRtcRiffIds: riffIds};
  case(CHAT_CHANGE_PEER_DISPLAY_NAME):
    let p = action.peer;
    const idx = state.webRtcPeers.map(item => item.id).indexOf(p.id);
    return {...state, webRtcPeerDisplayNames: [...state.webRtcPeerDisplayNames.slice(0, idx),
                                               action.displayName,
                                               ...state.webRtcPeerDisplayNames.slice(idx + 1)]};
  case(CHAT_CHANGE_PEER_RIFF_ID):
    let pp = action.peer;
    let [riffid, displayname] = pp.nick.split(' ');
    const iidx = state.webRtcPeers.map(item => item.id).indexOf(pp.id);
    console.log('changing riff id at index', iidx);
    return {...state, webRtcRiffIds: [...state.webRtcRiffIds.slice(0, iidx),
                                      action.riffId,
                                      ...state.webRtcRiffIds.slice(iidx + 1)]};
  case(CHAT_DISPLAY_NAME_CHANGE):
    console.log('saving display name in firebase: ', action);
    return {...state,
            savedDisplayName: action.status === 'success',
            savedDisplayMessage: action.message || '',
           };
  case(CHAT_WEBRTC_ID_CHANGE):
    console.log('webrtc ID change:', action);
    return {...state, webRtcId: action.webRtcId};
  case(CHAT_GET_MEDIA_ERROR):
    return {...state, getMediaError: action.error};
  case(CHAT_READY_TO_CALL):
    return {...state, readyToCall: true, getMediaError: false};
  case(JOINED_ROOM):
    return {...state, inRoom: true, joiningRoom: false};
  case(CHAT_LEAVE_ROOM):
    return {...state, webRtcRoom: '', inRoom: false,
            webRtcPeers: [], webRtcPeerDisplayNames: [], webRtcRiffIds: [], savedDisplayName: false};
  case(CHAT_VOLUME_CHANGED):
    if (action.volume !== null) {
      let vol1 = (((120 - Math.abs(action.volume)) / 120)*100);
      let vol2 = (Math.ceil(vol1)/20)*20;
      if (vol2 > 0) {
        return {...state, volume: vol2};
      } else {
        return state;
      }

    }
  case(CHAT_JOIN_ROOM_ERROR):
    return {...state, joinRoomError: action.msg};
  case(CHAT_CLEAR_JOIN_ROOM_ERROR):
    return {...state, joinRoomError: null};
  case(MUTE_AUDIO):
    return {...state, audioMuted: true};
  case(UNMUTE_AUDIO):
    return {...state, audioMuted: false};
  case(TEXT_CHAT_MSG_UPDATE):
    // will never be a message this user has sent (will always be peer)
    let dNames = state.webRtcPeers.map((p) => { return p.nick.split(" ")[1]; });
    let rIds = state.webRtcPeers.map((p) => { return p.nick.split(" ")[0]; });
    const peerIdx = rIds.indexOf(action.messageObj.participant);
    const dispName = dNames[peerIdx];
    let msg = {...action.messageObj,
               name: dispName};
    return {...state, textchat: {...state.textchat,
                                 messages: [...state.textchat.messages,
                                            msg],
                                 badge: 1}};
  default:
    return state;
  }
};

export default chat;
