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
  className: 'tabs is-boxed is-size-5'
})`
overflow-y: scroll;
max-height: 80vh;
ul {
-webkit-flex-direction: column;
flex-direction: column;
}
li+li {
margin-left: 0
}
li.selected {
  background-color: #d0bdda;
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
              height="500px" width="800px" title="Time spoken"/>
  );
};

const MeetingView = ({meeting, selected, handleMeetingClick}) => {
  let m = moment(meeting.startTime).format("ha MMM Do");
  return (
    <li class={selected ? 'selected' : false}><a onClick = {(event) => handleMeetingClick(event, meeting)}>
        <p>{m}</p>
    </a></li>
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
                           handleMeetingClick={handleMeetingClick}/>);
    });
  console.log("fetchmeetingstatus:", fetchMeetingsStatus);
  console.log("rendering meeting list");
  return (
    <MeetingTabs>
      <ul>
        {meetingTiles}
      </ul>
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
      <div class="columns has-text-centered">
        <div class="column is-one-quarter">
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
              : <div class="has-text-left">
                  <p class="is-size-4 is-primary">Room: {selectedMeeting.room} </p>
                  <p class="is-size-5 is-primary">{processedUtterances.length} Attendees </p>
                  <p class="is-size-5 is-primary">{selectedMeetingDuration} </p>

                  <TurnChart processedUtterances={processedUtterances} participantId={user.uid}/>

                  <div class="content">
                    <p>
                      The graph above represents the distribution of speaking during
                      your meeting, which is our turn-taking metric. In turn-taking, we
                      measure only active human vocalization, not the pauses in normal
                      speech, which is why time spoken is typically less than the
                      meeting duration.
                    </p>

                    <h2 class="is-size-2"> Why Turn-Taking? </h2>

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
                      Learn more &lt;linked below> about new Riff insights we’ll be releasing soon.
                    </p>
                  </div>

                  <div class="content">
                    <p>
                      The next two Riff metrics we’ll release are affirmations and
                      interruptions, both of which indicate dynamic, high-engagement
                      conversations.
                    </p>

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

                    <p>
                      Visit your My Riffs page often over the next few weeks, and see
                      what new insights are there.
                    </p>
                  </div>

                </div>
          }
        </div>
      </div>
      </div>
    );
  }
};

export default DashboardView;
