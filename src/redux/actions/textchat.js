import {
  TEXT_CHAT_SEND_MSG,
  TEXT_CHAT_MSG_UPDATE
} from '../constants/ActionTypes';

import { app, socket} from "../../riff";

export const sendTextChatMsg = (message, participant, meeting) => dispatch => {
  return app.service('messages').create({
    msg: message,
    participant: participant,
    meeting: meeting
  });
  // return {type: TEXT_CHAT_SEND_MSG,
  //         message,
  //         participant,
  //         meeting};
};

export const updateTextChat = (message, meeting, participant, time) => {
  return {type: TEXT_CHAT_MSG_UPDATE,
          message,
          meeting,
          participant,
          time};
};
