import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';

ReactChartkick.addAdapter(Chart);

const MeetingTabs = styled.div.attrs({
  className: 'timeline'
})`
padding-left: 2.5rem;
overflow-y: scroll;
max-height: 100vh;
&::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
&::-webkit-scrollbar-thumb {
    background: #FF0000;
}
`;

const formatChartData = (processedUtterances, participantId) => {
  console.log("formatting:", processedUtterances);

  const colorYou = '#ab45ab';
  const colorOther = '#bdc3c7';
  let nextOtherUser = 1;

  let data = [];
  let colors = [];

  processedUtterances.forEach(p => {
    // our display name from firebase if we've got it.
    let label = p.displayName;

    if (p.participantId === participantId) {
      data.unshift([ label || 'You', p.lengthUtterances]);
      colors.unshift(colorYou);
    }
    else {
      data.push([ label || `User ${nextOtherUser++}`, p.lengthUtterances]);
      colors.push(colorOther);
    }
  });

  return { data: data, colors: colors };
};

const TurnChart = ({processedUtterances, participantId}) => {
  let r = formatChartData(processedUtterances, participantId);
  console.log("data for chart:", r.data);

  const chartOptions = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.labels[tooltipItem.index] || '';
          let seconds = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || -1;
          let minutes = Math.trunc(seconds / 60);
          seconds = Math.round(seconds % 60);

          let tooltip = `${label}${label ? ': ' : ''}${minutes}m ${seconds}s`;
          return tooltip;
        }
      }
    }
  };

  return (
    <PieChart donut={true} library={chartOptions}
              data={r.data} colors={r.colors}
              height="30vw" width="30vw" title="Time spoken"/>
  );
};

const MeetingView = ({meeting, selected, handleMeetingClick}) => {
  let m = moment(meeting.startTime).format("ha MMM Do");
  return (
    <a onClick = {(event) => handleMeetingClick(event, meeting)}>
    <div class="timeline-item">
      <div class="timeline-marker is-image is-32x32">
        <MaterialIcon icon="voice_chat" color={selected ? '#ab45ab' : '#bdc3c7'} style={{marginLeft: '0.25rem', marginTop: '0.25rem'}}/>
      </div>

      <div class="timeline-content">
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
      <header class="timeline-header">
        <span class="tag is-medium is-primary">Today</span>
      </header>
      {meetingTiles}
    </MeetingTabs>
  );
};

const DashboardView = ({user, riffAuthToken, meetings,
                        fetchMeetingsStatus, fetchMeetingsMessage, numMeetings,
                        handleMeetingClick, selectedMeeting,
                        processedUtterances, statsStatus,
                        handleRefreshClick, selectedMeetingDuration}) =>
{
  console.log("fetch meetings status (view)", fetchMeetingsStatus, meetings);

  if (fetchMeetingsStatus === 'loading') {
    return (
      <div class="columns is-centered has-text-centered">
        <div class="column">
          <ScaleLoader color={"#8A6A94"}/>
        </div>
      </div>
    );
  } else if (fetchMeetingsStatus === 'error') {
    return (
      <div class="columns is-centered has-text-centered is-vcentered" style={{height: '90vh'}}>
        <div class="column is-vcentered" style={{alignItems: 'center'}}>
          <p class="is-size-4 is-primary">{fetchMeetingsMessage}</p>
          <ScaleLoader color={"#8A6A94"}/>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div class="columns">
          <div class="column is-one-fifth has-text-centered">
            <a class="button is-rounded"  onClick={event => handleRefreshClick(event, user.uid)}>
              <MaterialIcon icon="refresh"/>
            </a>
          </div>
        </div>
      <div class="columns has-text-centered is-centered">
        <div class="column is-one-quarter has-text-left">
          <MeetingList meetings={meetings}
                       selectedMeeting={selectedMeeting}
                       fetchMeetingsStatus={fetchMeetingsStatus}
                       fetchMeetingsMessage={fetchMeetingsMessage}
                       handleMeetingClick={handleMeetingClick}/>
        </div>
        <div class="column">
          {
            statsStatus === 'loading'
              ? <div>
              <ScaleLoader color={"#8A6A94"}/>
              </div>
              :
              <React.Fragment>
              <div class="columns">
                  <div class="column has-text-left">
                      <h2 class="is-size-3 is-primary">Room: {selectedMeeting.room} </h2>
                        <h3 class="is-size-4 is-primary">{processedUtterances.length} Attendees </h3>
                          <h3 class="is-size-4 is-primary">{selectedMeetingDuration} </h3>
                            <br/>
                            <h2 class="is-size-2 has-text-weight-semi-bold"> Why Turn-Taking? </h2>

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
                                <span class="has-text-weight-bold">The next two Riff metrics we’ll release </span>are affirmations and
                                  interruptions, both of which indicate dynamic, high-engagement
                                  conversations.
                                    </p>
                                    <br/>

                              <ul>
                                  <li>
                                      <strong>Affirmations</strong> are micro-gestures or vocalizations that signal
                                        you're listening, like nodding your head or saying "Ah ha" or "Uh
                        huh". They signal that listeners are attentive and engaged, and
                                        can indicate a cooperative relationship between participants.
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
                    <div class="column">
                        <div class="card has-text-centered is-centered" style={{borderRadius: '5px', maxWidth: '30vw'}}>
                            <div class="card-image has-text-centered is-centered">
                                <TurnChart processedUtterances={processedUtterances} participantId={user.uid}/>
                              </div>
                              <div class="card-content">
                                  <div class="title is-5 has-text-left">Time Spoken</div>
                                    <div class="content has-text-left is-size-7">
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
