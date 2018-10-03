import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';
import TurnChart from "./TurnChart";
import NetworkChart from "./NetworkChart";

const MeetingTabs = styled.div.attrs({
  className: 'timeline'
})`
padding-left: 2.5rem;
overflow-y: scroll;
max-height: 85vh;
&::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
&::-webkit-scrollbar-thumb {
    background: #FF0000;
}
`;

const MeetingView = ({meeting, selected, handleMeetingClick}) => {
  let m = moment(meeting.startTime).format("ha MMM Do");
  return (
    <a onClick = {(event) => handleMeetingClick(event, meeting)}>
    <div className="timeline-item">
      <div className="timeline-marker is-image is-32x32">
        <MaterialIcon icon="voice_chat" color={selected ? '#ab45ab' : '#bdc3c7'} style={{marginLeft: '0.25rem', marginTop: '0.25rem'}}/>
      </div>

      <div className="timeline-content">
        <span className={selected ? 'heading selected' : 'heading'}>
             <p>{m}</p>
            <p></p>
        </span>
      </div>
    </div>
    </a>

  );
};

const MeetingList = ({ fetchMeetingsStatus,
                       fetchMeetingsMessage,
                       meetings,
                       selectedMeeting,
                       handleMeetingClick }) => {
  let meetingTiles = meetings
    .map((meeting) => {
      return (<MeetingView key={meeting._id}
                           meeting={meeting}
                           selected={selectedMeeting !== null && meeting._id === selectedMeeting._id}
              handleMeetingClick={handleMeetingClick}/>

             );
    });
  console.log("fetchmeetingstatus:", fetchMeetingsStatus);
  console.log("rendering meeting list");
  return (
    <MeetingTabs>
      <header className="timeline-header">
        <span className="tag is-medium is-inverted is-primary">Today</span>
      </header>
      {meetingTiles}
    </MeetingTabs>
  );
};

const DashboardView = ({user, riffAuthToken, meetings,
                        fetchMeetingsStatus, fetchMeetingsMessage, numMeetings,
                        handleMeetingClick, selectedMeeting,
                        processedUtterances, statsStatus,
                        handleRefreshClick, selectedMeetingDuration, processedNetwork}) =>
{
  console.log("fetch meetings status (view)", fetchMeetingsStatus, meetings);

  if (fetchMeetingsStatus === 'loading') {
    return (
      <div className="columns is-centered has-text-centered">
        <div className="column">
          <ScaleLoader color={"#8A6A94"}/>
        </div>
      </div>
    );
  } else if (fetchMeetingsStatus === 'error') {
    return (
      <div className="columns is-centered has-text-centered is-vcentered" style={{height: '90vh'}}>
        <div className="column is-vcentered" style={{alignItems: 'center'}}>
          <p className="is-size-4 is-primary">{fetchMeetingsMessage}</p>
          <ScaleLoader color={"#8A6A94"}/>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth has-text-centered">
            <a className="button is-rounded"  onClick={event => handleRefreshClick(event, user.uid)}>
              <MaterialIcon icon="refresh"/>
            </a>
          </div>
        </div>
      <div className="columns has-text-centered is-centered">
        <div className="column is-one-quarter has-text-left">
          <MeetingList meetings={meetings}
                       selectedMeeting={selectedMeeting}
                       fetchMeetingsStatus={fetchMeetingsStatus}
                       fetchMeetingsMessage={fetchMeetingsMessage}
                       handleMeetingClick={handleMeetingClick}/>
        </div>
        <div className="column">
          {
            statsStatus === 'loading'
              ? <div>
                  <ScaleLoader color={"#8A6A94"}/>
                </div>
              :
                <React.Fragment>
                    <div className="columns" style={{maxHeight: "90vh", overflowY: 'scroll'}}>
                  <div className="column has-text-left">
                    <h2 className="is-size-3 is-primary">Room: {selectedMeeting.room} </h2>
                    <h3 className="is-size-4 is-primary">{processedUtterances.length} Attendees </h3>
                    <h3 className="is-size-4 is-primary">{selectedMeetingDuration} </h3>
                    <br/>

                      <div className="card has-text-centered is-centered"
                             style={{borderRadius: '5px', maxWidth: '30vw', paddingTop: '0.75rem'}}>
                          <div className="card-image has-text-centered is-centered">
                              <NetworkChart processedNetwork={processedNetwork} participantId={user.uid}/>
                            </div>
                            <div className="card-content">
                                <div className="title is-5 has-text-left">Influence</div>
                                  <div className="content has-text-left is-size-7">
                                      This network shows who most commonly speaks after whom.
                                        The thicker an edge is from person A to person B, the more likely A is to speak directly after B.
                                    </div>
                              </div>
                        </div>
                        <h2 className="is-size-3 has-text-weight-semi-bold"> Why Turn-Taking? </h2>
                    <p>
                      In highly collaborative groups, people tend to have even
                      turn-taking in which everyone is speaking and listening to each
                      other equally. In hierarchical groups, participants tend to speak
                      only in response to the meeting convener or manager, and not to
                      each other. When turn-taking is relatively equal, this indicates
                      a balanced conversation in which people are likely to have been
                      collaborating effectively.
                    </p>

                    <p>
                      <span className="has-text-weight-bold">The next two Riff metrics
                      we’ll release</span> are affirmations and interruptions, both of
                      which indicate dynamic, high-engagement conversations.
                    </p>
                    <br/>
                    <ul>
                      <li>
                        <strong>Affirmations</strong> are micro-gestures or vocalizations
                        that signal you're listening, like nodding your head or
                        saying "Ah ha" or "Uh huh". They signal that listeners
                        are attentive and engaged, and can indicate a cooperative
                        relationship between participants.
                      </li>

                      <li>
                        <strong>Interruptions</strong> are important for understanding how the group is
                        functioning overall.  Interruptions that allow the speaker to
                        continue, such as when someone says, "Oh, I see! That's so cool,"
                        indicate agreement and enthusiasm. Interruptions, that derail a
                        speaker and take over the conversation, suggest a power imbalance
                        within the group.
                      </li>
                    </ul>
                    <br/>
                    <p>
                      Visit your My Riffs page often over the next few weeks, and see
                      what new insights are there.
                    </p>
                  </div>
                  <div className="column">
                    <div className="card has-text-centered is-centered"
                         style={{borderRadius: '5px', maxWidth: '30vw', paddingTop: '0.75rem'}}>
                      <div className="card-image has-text-centered is-centered">
                          <TurnChart processedUtterances={processedUtterances} participantId={user.uid}/>
                      </div>
                      <div className="card-content">
                        <div className="title is-5 has-text-left">Time Spoken</div>
                        <div className="content has-text-left is-size-7">
                          The graph above represents the distribution of speaking during
                          your meeting, which is our turn-taking metric. In turn-taking, we
                          measure only active human vocalization, not the pauses in normal
                          speech, which is why time spoken is typically less than the
                          meeting duration.
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </React.Fragment>
              }
        </div>
      </div>
      </div>
    );
  }
};

export default DashboardView;
