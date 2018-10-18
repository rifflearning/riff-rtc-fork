import SimpleWebRTC from 'simplewebrtc';
import sibilant from 'sibilant-webaudio';
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
  saveLocalWebrtcId,
  changePeerDisplayName,
  changePeerRiffId
} from '../actions/chat';
import {
  updateRiffMeetingId,
  participantLeaveRoom
} from '../actions/riff';
import ReactDOM from 'react-dom';

import { logger } from '../../libs/utils';
import { app, socket } from '../../riff';
import captureSpeaking from '../../libs/audio';


export default function (nick, localVideoNode, dispatch, getState) {
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
    media: {
      audio: true,
      video: {
        width: { max: 640 },
        height: { max: 480 },
        frameRate: { max: 30 }
      }
    },
    debug: !!window.client_config.webrtc_debug
  };

  const webrtc = new SimpleWebRTC(webRtcConfig);

  logger.debug("Creating webrtc constant...", webrtc);
//  logger.debug("Local Session ID:", webrtc.connection.socket.sessionId)

  webrtc.on('videoAdded', function (video, peer) {
    logger.debug("added video", peer, video, "nick:", peer.nick);
    dispatch(addPeer({peer: peer, videoEl: video}));
    let [riffId, nick] = peer.nick.split(' ');
//    dispatch(changePeerRiffId(peer, riffId));
//    dispatch(changePeerDisplayName(peer, nick));
  });

  webrtc.on('videoRemoved', function (video, peer) {
    let state = getState();
    dispatch(removePeer({peer: peer,
                         videoEl: video}));
    if (state.chat.inRoom) {
      logger.debug("riff removing participant: ", peer.nick, "from meeting", state.riff.meetingId);
      let [riffId, ...rest] = peer.nick.split(" ");
      participantLeaveRoom(state.riff.meetingId, riffId);
    }
  });

  webrtc.on('localStreamRequestFailed', function (event) {
      dispatch(getMediaError(event));
  });

  webrtc.on('localStream', function (stream) {
    if (stream.active) {
      dispatch(getMediaError(false));
    }
  });

  webrtc.changeNick = function (nick) {
    this.config.nick = nick;
    this.webrtc.config.nick = nick;
  };

  webrtc.on('readyToCall', function (video, peer) {
    let stream = webrtc.webrtc.localStreams[0];
    // when using localvideonode, we don't get a stream in chrome.
    //let stream = localVideoNode.captureStream ? localVideoNode.captureStream() : localVideoNode.mozCaptureStream();
    dispatch(getMediaError(false));
    logger.debug("local webrtc connection id:", webrtc.connection.connection.id);
    dispatch(saveLocalWebrtcId(webrtc.connection.connection.id));

    var sib = new sibilant(stream);

    if (sib) {
      webrtc.stopVolumeCollection = function () {
        //sib.unbind('volumeChange');
      };

      webrtc.startVolumeCollection = function () {
        sib.bind('volumeChange', function (data) {
          let state = getState();
          if (!state.chat.inRoom) {
            dispatch(volumeChanged(data));
          }
        }.bind(getState));
      };

      // bind stopSibilant
      webrtc.stopSibilant = function () {
        //sib.unbind('volumeChange');
        sib.unbind('stoppedSpeaking');
      };

      // use this to show user volume to confirm audio/video working
      webrtc.startVolumeCollection();
      // sib.bind('volumeChange', function (data) {
      //   let state = getState();
      //   if (!state.chat.inRoom) {
      //     dispatch(volumeChanged(data));
      //   }
      // }.bind(getState));

      logger.debug(`webrtc readyToCall handler: binding to sib stoppedSpeaking w/ room? "${getState().chat.webRtcRoom}"`);
      sib.bind('stoppedSpeaking', (data) => {
        logger.debug(`webrtc readyToCall sib.stoppedSpeaking create utterance for user: ${getState().auth.user.uid} in room: "${getState().chat.webRtcRoom}"`);
        app.service('utterances').create({
          participant: getState().auth.user.uid,
          room: getState().chat.webRtcRoom,
          startTime: data.start.toISOString(),
          endTime: data.end.toISOString(),
          token: getState().riff.authToken
        }).then(function (res) {
          //logger.debug("speaking event recorded:", res)
          dispatch(updateRiffMeetingId(res.meeting));
        }).catch(function (err) {
          logger.error("ERROR", err);
        });
      });
      dispatch(readyToCall());
    }
  });

  return webrtc;
}
