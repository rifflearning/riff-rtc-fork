import { JOINING_ROOM,
         IN_ROOM,
         ADD_PEER,
         CHAT_SET_WEBRTC_CONFIG,
         CHAT_START_WEBRTC
       } from '../constants/ActionTypes';
import ReactDOM from 'react-dom';
import app from "../../firebase";
import { push } from 'react-router-redux';
import SimpleWebRTC from 'simplewebrtc';

export const saveWebRtcConfig = (config, signalMasterPath) => {
  return {
    type: CHAT_SET_WEBRTC_CONFIG,
    signalMasterPath: signalMasterPath,
    webRtcConfig: config
  };
};

export const startWebRtc = (webRtcConfig) => {
  let webrtc = new SimpleWebRTC(webRtcConfig);
  return {
    type: CHAT_START_WEBRTC,
    webRtc: webrtc
  };
};


export const setWebRtcConfig = (localVideoRef, email) => {
  let signalmasterPath = window.client_config.signalMaster.path || '';
  signalmasterPath += '/socket.io';
  let webRtcConfig = {
    localVideoEl: ReactDOM.findDOMNode(localVideoRef),
    remoteVideosEl: "", // handled by our component
    autoRequestMedia: true,
    url: window.client_config.signalMaster.url,
    socketio: {
      path: signalmasterPath,
      forceNew: true
    },
    nick: email,
    debug: !!window.client_config.webrtc_debug
  };
  return { webRtcConfig,
           signalmasterPath };
}

export const joinWebRtc = (localVideoRef, email) => dispatch => {
  let { webRtcConfig, signalMasterPath } = setWebRtcConfig(localVideoRef, email);
  dispatch(saveWebRtcConfig(webRtcConfig, signalMasterPath));
  dispatch(startWebRtc(webRtcConfig));
}
