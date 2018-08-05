import { MAKE_MEETING_INPUT_CHANGE,
         JOIN_ROOM } from '../constants/ActionTypes';
import app from "../../firebase"
import { push } from 'react-router-redux'

export const changeRoomNameState = (roomName) => {
  return {
    type: MAKE_MEETING_INPUT_CHANGE,
    roomName: roomName
  };
};

export const joinRoom = (roomName) => {
  console.log("room name:", roomName)
  return {
    type: JOIN_ROOM,
    roomName: roomName
  };
};
