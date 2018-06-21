import {log} from './utils';
const MM = require('./mm').MeetingMediator;
const _ = require('underscore');
const $ = require('jquery');

class Mediator {
  
  // COPIED FROM ORIGINAL RHYTHM-RTC PROJECT
  // with some minor modifications

  // just sums up values of the turns object.
  get_total_transitions(turns) {
    return _.reduce(_.values(turns), function(m, n){return m+n;}, 0);
  }

  // transform to the right data to send to chart
  transform_turns(participants, turns) {
    log("transforming turns:", turns);
    log("participants: ", participants);
    // filter out turns not by present participants
    var filtered_turns = _.filter(turns, function(turn){
      return _.contains(participants, turn.participant);
    });
    return filtered_turns;

  }

  // update MM turns if it matches this hangout.
  maybe_update_mm_turns(data) {
    log("mm data turns:", data);
    
    if (data.room === this.roomName && this.mm.data.participants.length > 1) {
      log("Updating meeting mediator")
      this.mm.updateData({participants: this.roomUsers,
        transitions: data.transitions,
        turns: this.transform_turns(this.roomUsers, data.turns)});
    } else {
      log("not updating...participants and room: ", data.room, this.roomName, this.mm.data.participants.length)
    }
  }

  // update MM participants if it matches this hangout.
  // removes the local participants from the list.
  maybe_update_mm_participants() {
    log('maybe updating mm partcipants...');
    // if there's only one person in the room, we want the ball to be at the center.
    // i think this should be handled by the viz code, but it's not and i
    // don't really want to modify it
    let newTurns = this.roomUsers.length > 1 ? this.mm.data.turns : [];
    this.mm.updateData({
      participants: this.roomUsers,
      transitions: this.mm.data.transitions,
      turns: newTurns
    });
  }

  update_users(users) {
    log("Updating users from: " + this.roomUsers + " to: " + users);
    this.roomUsers = users;
    this.maybe_update_mm_participants();
  }

  start_participant_listener() {
    log("starting listening for participants");
    var participantEvents = this.app.service('participantEvents');
    participantEvents.on('created', function (obj) {
      log("got a new participant event:", obj);
      log("roomname:", this.roomName);
      if (_.isEqual(obj.room, this.roomName)) {
        this.mm.updateData({
          participants: obj.participants,
          transitions: this.mm.data.transitions,
          turns: this.mm.data.turns
        });
      }
    }.bind(this));
  }

  start_meeting_listener() {
    log("starting listening for participants -- 2");
    var meetings = this.app.service('meetings');
    meetings.on('patched', function (obj) {
      log("meeting got updated:", obj);
      log("roomname:", this.roomName);
      if (_.isEqual(obj.room, this.roomName)) {
        log("room matches... updating meeting mediator")
        this.mm.updateData({
          participants: this.roomUsers,
          transitions: this.mm.data.transitions,
          turns: this.mm.data.turns
        });
      }
    }.bind(this));
  }

  constructor(app, participants, user, roomName) {
    log("INITIAL ROOMANME", roomName);
    
    this.mm = null;
    this.mm_width = 300;
    this.mm_height = 300;
    log('>> Starting meeting mediator...');
    this.app = app;
    this.user = user;
    this.roomName = roomName;
    this.roomUsers = participants;

    if (!($('#meeting-mediator').is(':empty'))) {
      log("not starting a second MM...");
      return;
    }

    this.turns = this.app.service('turns');
    log('MM participants:', this.roomUsers);
    log("meeting mediator:", MM);
    this.mm = new MM({participants: this.roomUsers,
      transitions: 0,
      turns: [],
      names: []},
      [this.user],
      this.mm_width,
      this.mm_height);
    this.mm.render('#meeting-mediator');
    this.maybe_update_mm_turns = this.maybe_update_mm_turns.bind(this);
    this.turns.on("updated", this.maybe_update_mm_turns)
    //this.start_participant_listener();
    this.start_meeting_listener();
  }

}

export default Mediator
