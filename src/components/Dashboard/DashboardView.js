import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import Chart from 'chart.js';
import {XYPlot, XAxis, YAxis,
        VerticalBarSeries,
        HorizontalGridLines,
        LineSeries} from 'react-vis';
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
`;

const formatChartData = (processedUtterances, participantId) => {
  console.log("formatting:", processedUtterances);

  let ids = _.uniq(_.map(processedUtterances, (p) => { return p.participantId}));

  let data = _.map(processedUtterances, (p, idx) => {
    let label = (p.participantId == participantId ? 'You' : "User " + idx);
    //console.log(p)
    // use our display name from firebase if we've got it.
    label = p.displayName ? p.displayName : label;
    return [label, p.lengthUtterances];
  });
  let colors = _.map(processedUtterances, (p) => {
    if (p.participantId == participantId) {
      return "#ab45ab";
    } else {
      return "#bdc3c7";
    }
  });
  return {data: data, colors: colors};
};

const TurnChart = ({processedUtterances, participantId}) => {
  let r = formatChartData(processedUtterances, participantId);
  console.log("data for chart:", r.data);
  return (
    <PieChart donut={true} height="500px" width="800px" data={r.data} title="Seconds spoken" colors={r.colors}/>
  );
};

// const TurnChart = ({processedUtterances}) => {
//   let data = formatChartData(processedUtterances);
//   console.log("data for chart:", data);
//   return (
//     <XYPlot
//   width={500}
//   height={300}>
//     <HorizontalGridLines />
//     <VerticalBarSeries
//       data={data}
//       xType="ordinal"/>
//     <XAxis />
//     <YAxis />
//     </XYPlot>);
// };

const MeetingView = ({meeting, handleMeetingClick}) => {
  let m = moment(meeting.startTime).format("ha MMM Do");
  return (
    <li><a onClick = {(event) => handleMeetingClick(event, meeting)}>
        <p>{m}</p>
    </a></li>
  );
};

const MeetingList = ({fetchMeetingStatus, meetings, handleMeetingClick}) => {
  let meetingTiles = meetings.map((meeting) => {
    return (<MeetingView key={meeting._id} meeting={meeting} handleMeetingClick={handleMeetingClick}/>);
  });
  if (fetchMeetingStatus == 'loading') {
    return (<p> Loading...</p>);
  } else {
    return (
      <MeetingTabs>
        <ul>
          {meetingTiles}
        </ul>
      </MeetingTabs>
    );
  }
};

const DashboardView = ({user, riffAuthToken, meetings,
                        fetchMeetingStatus, numMeetings,
                        handleMeetingClick, selectedMeeting,
                        processedUtterances, statsStatus}) => (
  <div class="columns has-text-centered">
    <div class="column is-one-quarter">
      <MeetingList meetings={meetings} fetchMeetingStatus={fetchMeetingStatus} handleMeetingClick={handleMeetingClick}/>
    </div>
    <div class="column">
      {statsStatus == 'loading' ?
        <p> Loading...</p>
          :
          <div>
            <p>Meeting content goes here.</p>
            <p>Showing content for meeting {selectedMeeting._id}</p>
              <p>like, that it has {processedUtterances.length > 0 ? processedUtterances[0].numUtterances : "N/A"} utterances.</p>
                <TurnChart processedUtterances={processedUtterances} participantId={user.uid}/>
          </div>
      }
    </div>
  </div>
);

export default DashboardView;
