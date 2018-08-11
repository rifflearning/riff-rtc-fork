import { JOINING_ROOM,
         JOINED_ROOM,
         IN_ROOM,
         ADD_PEER,
         REMOVE_PEER,
         CHAT_READY_TO_CALL,
         CHAT_SET_WEBRTC_CONFIG,
         CHAT_START_WEBRTC
       } from '../constants/ActionTypes';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import app from "../../firebase";
import { push } from 'connected-react-router';


export const joinWebRtc = (localVideoRef, email) => dispatch => {
  console.log("trying to start....;;;;")
//  let { webRtcConfig, signalMasterPath } = setWebRtcConfig(localVideoRef, email);
//  dispatch(saveWebRtcConfig(webRtcConfig, signalMasterPath));
//  dispatch(startWebRtc(webRtcConfig));
}
