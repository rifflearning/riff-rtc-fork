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
  leaveRoom,
  changePeerDisplayName
} from './actions/chat';
import {
  updateRiffMeetingId
} from './actions/riff';
import ReactDOM from 'react-dom';

import { app, socket } from '../riff';
import captureSpeaking from '../libs/audio';




export default function (nick, localVideoNode, dispatch, getState) {
  console.log("getState:", getState);
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

  webrtc.on('channelMessage', function (peer, channelLabel, payload) {
    console.log(">> webrtc got a message:", peer, channelLabel, payload);
    switch(channelLabel) {
    case('DISPLAY_NAME'):
      console.log("changing display name for peer ", peer, payload, channelLabel);
      dispatch(changePeerDisplayName(peer, payload.payload));
    }
  });

  webrtc.on('readyToCall', function (video, peer) {
    console.log("sib:", sib);
    let stream = localVideoNode.captureStream ? localVideoNode.captureStream() : localVideoNode.mozCaptureStream();
    var sib = new sibilant(stream);



    webrtc.stopVolumeCollection = function () {
      sib.unbind('volumeChange');
    };

    // bind stopSibilant
    webrtc.stopSibilant = function () {
      sib.unbind('volumeChange');
      sib.unbind('stoppedSpeaking');
    };

    // use this to show user volume to confirm audio/video working
    sib.bind('volumeChange', function (data) {
      let state = getState();
      if (!state.chat.inRoom) {
          dispatch(volumeChanged(data));
        }
    }.bind(getState));

    sib.bind('stoppedSpeaking', (data) => {
      app.service('utterances').create({
        participant: getState().auth.user.uid,
        room: getState().chat.roomName,
        startTime: data.start.toISOString(),
        endTime: data.end.toISOString(),
        token: getState().riff.authToken
      }).then(function (res) {
        //console.log("speaking event recorded:", res)
        dispatch(updateRiffMeetingId(res.meeting));
      }).catch(function (err) {
        console.log("ERROR", err);
      });
    });
    dispatch(readyToCall());
  });

  return webrtc;
}
