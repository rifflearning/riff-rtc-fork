import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart } from 'react-chartkick';
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

const formatChartData = (processedUtterances) => {
  console.log("formatting:", processedUtterances);
  return _.map(processedUtterances, (p) => {
    return [p.participantId, p.lengthUtterances];
    // return {x: p.participantId,
    //         y: p.numUtterances};
  });
};

const TurnChart = ({processedUtterances}) => {
  let data = formatChartData(processedUtterances);
  console.log("data for chart:", data);
  return (
    <ColumnChart height="500px" width="800px" data={data} title="Seconds spoken" colors={["#ab45ab"]}/>
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
  console.log("rendering meeting:", meeting);
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
                <TurnChart processedUtterances={processedUtterances}/>
          </div>
      }
    </div>
  </div>
);

export default DashboardView;
