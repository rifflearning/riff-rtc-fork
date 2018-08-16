import SimpleWebRTC from 'simplewebrtc';
import sibilant from 'sibilant-webaudio';
import { JOINING_ROOM,
         JOINED_ROOM,
         IN_ROOM,
         ADD_PEER,
         REMOVE_PEER,
         CHAT_READY_TO_CALL,
         CHAT_SET_WEBRTC_CONFIG,
         CHAT_START_WEBRTC,
         CHAT_GET_MEDIA_ERROR,
         CHAT_SHARE_STREAM,
         CHAT_VOLUME_CHANGED
       } from './constants/ActionTypes';
import {
  addPeer,
  removePeer,
  readyToCall,
  shareStream,
  volumeChanged,
  getMediaError,
  changeRoomName,
  muteAudio,
  unMuteAudio,
  leaveRoom
} from './actions/chat';
import ReactDOM from 'react-dom';

import { app, socket } from '../riff';
import captureSpeaking from '../libs/audio';




export default function (nick, localVideoNode, dispatch, state) {
  let chatState = state.chat;
  let authState = state.auth;
  let riffState = state.riff;
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
    console.log("added video", peer, video);
    dispatch(addPeer({peer: peer,
                      videoEl: video}));
    console.log("getPeers:", webrtc.getPeers());
  });

  webrtc.on('videoRemoved', function (video, peer) {
    console.log("removed video")
    dispatch(removePeer({peer: peer,
                         videoEl: video}));
  });

  webrtc.on('localStreamRequestFailed', function (event) {
    console.log("failed request:", event);
    dispatch(getMediaError(event));
  });

  // in the future, dispatch a sibilant action to start measuring maybe
  let stream = localVideoNode.captureStream ? localVideoNode.captureStream() : localVideoNode.mozCaptureStream();
  var sib = new sibilant(stream);

  webrtc.on('readyToCall', function (video, peer) {
    console.log("sib:", sib);
    // use this to show user volume to confirm audio/video working
    sib.bind('volumeChange', function (data) {
      if (!chatState.inRoom) {
          dispatch(volumeChanged(data));
        }
    }.bind(chatState));

    sib.bind('stoppedSpeaking', captureSpeaking(app,
                                                {
                                                  username: authState.user.uid,
                                                  roomName: chatState.roomName,
                                                  token: riffState.token
                                                }));
    dispatch(readyToCall());
    // if (webrtc.testReadiness()) {
      
    // }
  });

  webrtc.stopVolumeCollection = function () {
    sib.unbind('volumeChange');
  };

  webrtc.stopSibilant = function () {
    sib.unbind('volumeChange');
    sib.unbind('stoppedSpeaking');
  };

  return webrtc;
}
