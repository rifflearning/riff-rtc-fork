import {app, socket} from '../../riff';
import {
  updateMeetingParticipants,
  updateTurnData,
  updateRiffMeetingId} from '../actions/riff';
import {
  updateTextChat} from '../actions/textchat';
import { logger } from '../../libs/utils';


function transformTurns(participants, turns) {
  let filteredTurns = turns.filter(turn => participants.includes(turn.participant));
  return filteredTurns;
}

export default function (dispatch, getState) {
  // this listener listens for events ~from~ the server

  app.service('turns').on('updated', function (obj) {
    let state = getState();
    if (obj.room === state.chat.webRtcRoom && state.riff.participants.length > 1) {
      logger.debug("Updating turns");
      dispatch(updateTurnData(obj.transitions,
                              transformTurns(state.riff.participants, obj.turns)));
    }
  });

  app.service('participantEvents').on('created', function (obj) {
    let state = getState();
    logger.debug('riff listener.participantEvents.created: entered', { obj, expectedRoom: state.chat.webRtcRoom });
    if (obj.meeting.room === state.chat.webRtcRoom) {
      logger.debug('riff listener.participantEvents.created: updating participants',
                   { from: state.riff.participants, to: obj.participants, obj });
      // update meeting mediator data
      dispatch(updateMeetingParticipants(obj.participants));
      dispatch(updateRiffMeetingId(obj.meeting._id));
    }
  });

  app.service('messages').on('created', function (obj) {
    let state = getState();
    logger.debug('riff listener.messages.created', obj);
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
  //   if (obj.room === state.chat.webRtcRoom) {
  //     console.log("Got update for meeting", obj.room);
  //     dispatch(meetingUpdated())
  //   }
  // })
}
