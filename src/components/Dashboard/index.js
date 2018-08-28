import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import auth from "../../firebase";
import {
  loadRecentMeetings,
  selectMeeting,
  loadMeetingData}
from "../../redux/actions/dashboard";
import { push } from 'connected-react-router';
import { riffAddUserToMeeting } from '../../redux/actions/riff';
import lifecycle from 'react-pure-lifecycle';
import DashboardView from './DashboardView';

const mapStateToProps = state => ({
  user: state.auth.user,
  riff: state.riff,
  riffAuthToken: state.riff.authToken,
  meetings: state.dashboard.meetings,
  numMeetings: state.dashboard.numMeetings,
  fetchMeetingStatus: state.dashboard.fetchMeetingStatus,
  lastFetched: state.dashboard.lastFetched,
  shouldFetch: state.dashboard.shouldFetch,
  selectedMeeting: state.dashboard.selectedMeeting || "",
  processedUtterances: state.dashboard.processedUtterances,
  statsStatus: state.dashboard.statsStatus
});

const mapDispatchToProps = dispatch => ({
  loadRecentMeetings: (uid) => {
    dispatch(loadRecentMeetings(uid));
  },
  handleMeetingClick: (event, meeting) => {
    event.preventDefault();
    console.log("selected meeting", meeting._id);
    dispatch(selectMeeting(meeting));
    dispatch(loadMeetingData(meeting._id));
  },
});

const componentDidUpdate = (props) => {
  console.log("component updating...", props.riffAuthToken);
  if (props.riffAuthToken && props.shouldFetch) {
    console.log("going to load recent meetings");
    props.loadRecentMeetings(props.user.uid);
  }
}

const componentDidMount = (props) => {
  if (props.riffAuthToken) {
    console.log("going to load recent meetings");
    props.loadRecentMeetings(props.user.uid);
  }
};

const methods = {
  componentDidUpdate,
  componentDidMount
};

const Dashboard = lifecycle(methods)(DashboardView);

export default withRouter(
  connect(mapStateToProps,
          mapDispatchToProps)(Dashboard));
