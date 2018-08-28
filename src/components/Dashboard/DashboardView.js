import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';

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
    <div class="column is-one-third">
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
          </div>
      }
    </div>
  </div>
);

export default DashboardView;
