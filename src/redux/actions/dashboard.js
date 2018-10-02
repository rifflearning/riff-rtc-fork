import {
  DASHBOARD_UPDATE_MEETING_LIST,
  DASHBOARD_FETCH_MEETINGS,
  DASHBOARD_SELECT_MEETING,
  DASHBOARD_FETCH_MEETING_STATS,
  DASHBOARD_FETCH_MEETING_NETWORK
} from '../constants/ActionTypes';
import _ from 'underscore';
import { app, socket} from "../../riff";
import firebaseApp from '../../firebase';

let db = firebaseApp.firestore();

export const updateMeetingList = (meetings) => {
  return {type: DASHBOARD_FETCH_MEETINGS,
          status: 'loaded',
          meetings: meetings};
};

export const selectMeeting = (meeting) => {
  return {type: DASHBOARD_SELECT_MEETING,
          meeting: meeting};
};

export const loadRecentMeetings = (uid, selectedMeeting) => dispatch => {
  dispatch({type: DASHBOARD_FETCH_MEETINGS, status: 'loading'});
  return app.service('participants').find({query: {_id: uid}})
    .then((res) => {
      if (res.data.length == 0) {
        // no found participants. Throw an error to break out early.
        throw new Error("no participant");
      }
      console.log(">>fetched participant:", res);
      return res.data[0];
    })
    .then((participant) => {
      return participant.meetings;
    })
    .then((meetingIds) => {
      return app.service('meetings').find({query: {_id: meetingIds}});
    })
    .then((meetingObjects) => {
      console.log("raw meeting objects received:", meetingObjects);
      meetingObjects = _.filter(meetingObjects, (m, idx) => {
        if (!m.endTime) {
          return true;
        }
        let durationSecs = (new Date(m.endTime).getTime() - new Date(m.startTime).getTime()) / 1000;
        //console.log("duration secs:", durationSecs)
        return durationSecs > 2*60;
      });
      if (meetingObjects.length == 0) {
        console.log("no meetings over 2 minutes", );
        throw new Error("no meetings after filter");
      }
      console.log("meeting objs after duration filter:", meetingObjects);
      return meetingObjects;
      //dispatch(updateMeetingList(meetingObjects));
    })
    .then(meetingObjects => {
      let pEvents = _.map(meetingObjects, (m) => {
        return app.service('participantEvents').find({query: {meeting: m._id, $limit: 500}})
      });
      return Promise.all(pEvents)
        .then(function (vals) {
          console.log("pevents in promise", vals);
          return {meetings: meetingObjects, pEvents: vals};
        });
    })
    .then(({meetings, pEvents}) => {
      console.log("got pevents:", pEvents);
      console.log("got meetings:", meetings);
      // only return meetings that have over 1 participant.
      let numParticipants = _.map(pEvents, pe => {
        return _.uniq(_.flatten(_.map(pe.data, (p) => { return p.participants}))).length;
      });
      // TODO: this will include meetings where someone joins but does not speak.
      // because we use the utterance data to inform our shit, the # of attendees will also be wrong.
      // right thing to do here is to try and create a service on the server that will reliably give
      // us # of attendees
      console.log("num participants:", numParticipants, meetings);
      meetings = _.filter(meetings, (m, idx) => {return numParticipants[idx] >= 2});
      console.log("kept meetings:", meetings);
      if (meetings.length == 0) {
        throw new Error("no meetings after nparticipants filter");
      }
      meetings.sort((a, b) => /*descending*/ -cmpMeetingsByStartTime(a, b));
      dispatch(updateMeetingList(meetings));
      if (meetings.length > 0) {
        let newSelectedMeeting = meetings[0];
        dispatch(selectMeeting(newSelectedMeeting));
        dispatch(loadMeetingData(newSelectedMeeting._id));
      }
      //return meetings;
    })
    .catch((err) => {
      if (err.message == 'no participant') {
        dispatch({type: DASHBOARD_FETCH_MEETINGS,
                  status: 'error',
                  message: "No meetings found. Meetings that last for over two minutes will show up here."});
      } else if (err.message == 'no meetings after filter') {
        dispatch({type: DASHBOARD_FETCH_MEETINGS,
                  status: 'error',
                  message: "We'll only show meetings that lasted for over two minutes. Go have a riff!"});
      } else if (err.message == 'no meetings after nparticipants filter') {
        dispatch({type: DASHBOARD_FETCH_MEETINGS,
                  status: 'error',
                  message: "Only had meetings by yourself? Come back after some meetings with others to explore some insights."});
      } else {
        // infinite loop?
        console.log("Couldn't retrieve meetings", err);
        dispatch(loadRecentMeetings(uid));
      }
    });
};

let processUtterances = (utterances, meetingId) => {
  console.log("processing utterances:", utterances);
  // {'participant': [utteranceObject, ...]}
  var participantUtterances = _.groupBy(utterances, 'participant');
  // {'participant': number of utterances}
  var numUtterances = _.mapObject(participantUtterances, (val, key) => {
    return val.length;
  });
  var lengthUtterances = _.mapObject(participantUtterances, (val,key) => {
    var lengthsUtterances = val.map((utteranceObject) => {
      return (new Date(utteranceObject.endTime).getTime() - new Date(utteranceObject.startTime).getTime()) / 1000;
    });
    return lengthsUtterances.reduce((previous, current) => current + previous, 0);
  });
  // {'participant': mean length of utterances in seconds}
  var meanLengthUtterances = _.mapObject(participantUtterances, (val, key) => {
    var lengthsUtterances = val.map((utteranceObject) => {
      return (new Date(utteranceObject.endTime).getTime() - new Date(utteranceObject.startTime).getTime()) / 1000;
    });
    var sum = lengthsUtterances.reduce((previous, current) => current + previous, 0);
    return sum / lengthsUtterances.length;
  });
  let participants = Object.keys(participantUtterances);

  var visualizationData = participants.map((participantId) => {
    return {
      //    name: participant['name'],
      participantId: participantId,
      lengthUtterances: participantId in lengthUtterances ? lengthUtterances[participantId] : 0,
      numUtterances: participantId in numUtterances ? numUtterances[participantId] : 0,
      meanLengthUtterances: participantId in meanLengthUtterances ? meanLengthUtterances[participantId] : 0
    };
  });

  let promises = _.map(visualizationData, (v) => {
    let docId = v.participantId + "_" + meetingId;
    let docRef = db.collection('meetings').doc(docId);
    return docRef.get().then((doc) => {
      return Object.assign(v, {displayName: doc.displayName,
                               meetingId: meetingId});
    });
  });
  return Promise.all(promises);
  //console.log("data returned:", visualizationData);
  //return visualizationData;
};

/* **************************************************************************
 * cmpMeetingsByStartTime                                              */ /**
 *
 * Comparison functor for meetings based on their start times.
 *
 * @returns {number} -1 if a < b, 1 if a > b, 0 if a = b
 */
function cmpMeetingsByStartTime(a, b) {
  return a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0;
}

// goal is to process and create a network of who follows whom
// each node is a participant
// each directed edge A->B indicates probability that B follows A. 
export const processNetwork = (utterances, meetingId) => {
  let participantUtterances = _.groupBy(utterances, 'participant');
  let participants = Object.keys(participantUtterances);
  let sortedUtterances = _.sortBy(utterances, (u) => { return u.startTime; });

  let recentUttCounts = _.map(sortedUtterances, (ut, idx, l) => {
    // get list of utterances within 2 seconds that are not by the speaker.
    let recentUtterances = _.filter(sortedUtterances.slice(0, idx), (recentUt) => {
      let recent = ((new Date(ut.startTime).getTime() - new Date(recentUt.endTime).getTime()) / 1000) < 2;
      let sameParticipant = ut.participant == recentUt.participant;
      return recent && !sameParticipant;
    });
    if (recentUtterances.length > 0) {
      return {participant: ut.participant,
              counts: _.countBy(recentUtterances, 'participant')};
    } else {
      return false;
    }
  });

  recentUttCounts = _.compact(recentUttCounts);
  console.log("recent utt counts:", recentUttCounts);

  // create object with the following format:
  // {participantId: {participantId: Count, participantId: Count, ...}}
  let aggregatedCounts = _.reduce(recentUttCounts, (memo, val, idx, l) => {
    if (!memo[val.participant]) {
      memo[val.participant] = val.counts;
    } else {
      // update count object that's stored in memo, adding new 
      // keys as we need to.
      // obj here should be an object of {participantId: nUtterances}
      let obj = memo[val.participant];
      _.each(_.pairs(val.counts), (pair) => {
        if (!obj[pair[0]]) {
          obj[pair[0]] = pair[1];
        } else {
          obj[pair[0]] += pair[1];
        }
      });
      memo[val.participant] = obj;
    }
    return memo;
  }, {});

  let finalEdges = [];
  let edges = _.each(_.pairs(aggregatedCounts), (obj, idx) => {
    let participant = obj[0];
    _.each(_.pairs(obj[1]), (o) => {
      let toAppend = {source: participant, target: o[0], size: o[1]};
      finalEdges.push(toAppend);
    });
  });

  // make edge sizes between 0 and 1, and then multiply by sizeMultiplier
  let maxEdgeSize = _.max(finalEdges, (e) => { return e.size; }).size;
  let sizeMultiplier = 15;
  finalEdges = _.map(finalEdges, (e, idx) => { return { ...e,
                                                        id: "e" + idx,
                                                        size: (e.size / maxEdgeSize)*sizeMultiplier};});
  // filter any edges under 0.2 weight
  finalEdges = _.filter(finalEdges, (e) => { return !(e.size < 0.1*sizeMultiplier); });
  let nodes = _.map(participants, (p, idx) => { return {id: p,
                                                        size: 20}; });
  console.log("nodes", nodes, "edges", finalEdges);

  let promises = _.map(nodes, (n) => {
    return app.service('participants').get(n.id)
      .then((res) => {
        return {...n, label: res.name};
      });
  });

  return Promise.all(promises).then(values => {
    return {nodes: values,
            edges: finalEdges};
  });
};

export const loadMeetingData = (meetingId) => dispatch => {
  dispatch({type: DASHBOARD_FETCH_MEETING_STATS, status: 'loading'});
  console.log("finding utterances for meeting", meetingId);
  return app.service('utterances').find({query: {meeting: meetingId, $limit: 10000}})
    .then((utterances) => {
      console.log("utterances", utterances);
      return {processedUtterances: processUtterances(utterances, meetingId),
              processedNetwork: processNetwork(utterances, meetingId)};

    }).then(({processedUtterances, processedNetwork}) => {
      console.log("utterances:", processedUtterances, "network:", processedNetwork);

      processedNetwork.then((networkObj) => {
        dispatch({type: DASHBOARD_FETCH_MEETING_NETWORK,
                  status: 'loaded',
                  networkData: networkObj});
      });

      processedUtterances.then((processedUtterances) => {
        let promises = _.map(processedUtterances, (u) => {
          return app.service('participants').get(u.participantId)
            .then((res) => {
              return {...u, name: res.name};
            });
        });
        Promise.all(promises).then((processedUtterances) => {
          console.log("processed utterances:", processedUtterances);
          dispatch({type: DASHBOARD_FETCH_MEETING_STATS,
                    status: 'loaded',
                    processedUtterances: processedUtterances});
        });
      });
    }).catch(err => {
      console.log("couldn't retrieve meeting data", err);
    });
};
