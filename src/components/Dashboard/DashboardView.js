import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const MeetingView = ({meeting}) => {
  console.log("rendering meeting:", meeting)
  return (
    <div class="tile is-4 is-primary is-parent">
      <div class="tile is-child box">
        <p class="title">{meeting.room}</p>
        <p >{meeting.startTime}</p>
      </div>
    </div>
  );
};

const MeetingList = ({fetchMeetingStatus, meetings}) => {
  let meetingTiles = meetings.map((meeting) => {
    return (<MeetingView key={meeting._id} meeting={meeting}/>);
  });
  if (fetchMeetingStatus == 'loading') {
    return (<p> Loading...</p>);
  } else {
    return (
      <div class="tile is-ancestor is-vertical">
        {meetingTiles}
      </div>
    );
  }
};

const DashboardView = ({user, riffAuthToken, meetings,
                        fetchMeetingStatus, numMeetings}) => (
  <div class="columns is-centered has-text-center">
    <div class="column">
      <p>Hiiii Dashboard</p>
      <MeetingList meetings={meetings} fetchMeetingStatus={fetchMeetingStatus}/>
    </div>
  </div>
);

export default DashboardView;
