import SimpleWebRTC from 'simplewebrtc';
import { JOINING_ROOM,
         JOINED_ROOM,
         IN_ROOM,
         ADD_PEER,
         REMOVE_PEER,
         CHAT_READY_TO_CALL,
         CHAT_SET_WEBRTC_CONFIG,
         CHAT_START_WEBRTC
       } from './constants/ActionTypes';
import ReactDOM from 'react-dom';


console.log("Creating webrtc constant...");

const addPeer = (peer) => {
  return {
    type: ADD_PEER,
    peer: peer
  };
};

const removePeer = (peer) => {
  return {
    type: REMOVE_PEER,
    peer: peer
  };
};


const readyToCall = (roomName) => {
  return {
    type: CHAT_READY_TO_CALL,
    roomName: roomName
  };
};


export default function (nick, localVideoNode, dispatch, chatState) {
  let signalmasterPath = window.client_config.signalMaster.path || '';
  signalmasterPath += '/socket.io';
  let webRtcConfig = {
    localVideoEl: localVideoNode,
    remoteVideosEl: "", // handled by our component
    autoRequestMedia: true,
    url: window.client_config.signalMaster.url,
    nick: nick,
    socketio: {
      path: signalmasterPath,
      forceNew: true
    },
    debug: !!window.client_config.webrtc_debug
  };

  const webrtc = new SimpleWebRTC(webRtcConfig);

  console.log("Creating webrtc constant...");

  webrtc.on('videoAdded', function (video, peer) {
    dispatch(addPeer(peer));
  });

  webrtc.on('videoRemoved', function (video, peer) {
    dispatch(removePeer(peer));
  });

  webrtc.on('readyToCall', function (video, peer) {
    console.log("READY TO CALL!!!");
    webrtc.joinRoom(chatState.roomName, function (err, rd) {
      console.log("joined room");
      dispatch({type: JOINED_ROOM});
      console.log(err, "---", rd);
    });
    dispatch(readyToCall(chatState.roomName));
  });
}
