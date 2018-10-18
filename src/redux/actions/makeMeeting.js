import { MAKE_MEETING_INPUT_CHANGE } from '../constants/ActionTypes';

export const changeRoomNameState = (roomName) => {
  return {
    type: MAKE_MEETING_INPUT_CHANGE,
    roomName: roomName
  };
};
