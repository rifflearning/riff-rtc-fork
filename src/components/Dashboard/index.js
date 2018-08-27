import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import auth from "../../firebase";
import {
  loadRecentMeetings }
from "../../redux/actions/dashboard";
import { push } from 'connected-react-router';
import { riffAddUserToMeeting } from '../../redux/actions/riff';
import lifecycle from 'react-pure-lifecycle';
import DashboardView from './DashboardView';

const mapStateToProps = state => ({
  user: state.auth.user,
  riff: state.riff,
  riffAuthToken: state.riff.authToken
});

const mapDispatchToProps = dispatch => ({
  loadRecentMeetings: (uid) => {
    dispatch(loadRecentMeetings(uid));
  }
});

const componentDidUpdate = (props) => {
  console.log("component updating...", props.riffAuthToken)
  if (props.riffAuthToken) {
    console.log("going to load recent meetings");
    props.loadRecentMeetings(props.user.uid);
  }
}

const methods = {
  componentDidUpdate
};

const Dashboard = lifecycle(methods)(DashboardView);

export default withRouter(
  connect(mapStateToProps,
          mapDispatchToProps)(Dashboard));
