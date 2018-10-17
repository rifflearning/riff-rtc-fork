import {app, socket} from '../../riff';
import {
  updateMeetingParticipants,
  updateTurnData,
  updateRiffMeetingId} from '../actions/riff';
import {
  updateTextChat} from '../actions/textchat';


function transformTurns(participants, turns) {
  var filteredTurns = turns.filter(turn => participants.includes(turn.participant));
  return filteredTurns;
}

export default function (dispatch, getState) {
  // this listener listens for events ~from~ the server

  app.service('turns').on('updated', function (obj) {
    var state = getState();
    if (obj.room === state.chat.roomName && state.riff.participants.length > 1) {
      console.log("Updating turns");
      dispatch(updateTurnData(obj.transitions,
                              transformTurns(state.riff.participants, obj.turns)));
    }
  });

  app.service('participantEvents').on('created', function (obj) {
    var state = getState();
    if (obj.meeting.room === state.chat.roomName) {
      console.log("updating participants from", state.riff.participants, "to", obj.participants);
      // update meeting mediator data
      dispatch(updateMeetingParticipants(obj.participants));
      dispatch(updateRiffMeetingId(obj.meeting._id));
    }
  });

  app.service('messages').on('created', function (obj) {
    var state = getState();
    console.log("message created!", obj);
    if (obj.meeting === state.riff.meetingId &&
        obj.participant != state.auth.user.uid) {
      dispatch(updateTextChat(
        obj.msg,
        obj.meeting,
        obj.participant,
        obj.time
      ));
    }
  });

  // this.app.service('meetings').on('patched', function (obj) {
  //   if (obj.room === state.chat.roomName) {
  //     console.log("Got update for meeting", obj.room);
  //     dispatch(meetingUpdated())
  //   }
  // })
}
