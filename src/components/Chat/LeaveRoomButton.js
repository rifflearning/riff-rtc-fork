import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { push } from 'connected-react-router';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
  meetingId: state.riff.meetingId,
  uid: state.auth.user.uid
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  redirectHome: () => {
    dispatch(push("/home"));
  }
});

const mapMergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  leaveRoom: (event) => {
    event.preventDefault();
    ownProps.leaveRiffRoom(stateProps.meetingId, stateProps.uid);
    ownProps.leaveRoom();
    ownProps.webrtc.stopLocalVideo();
    ownProps.webrtc.leaveRoom();
    ownProps.webrtc.stopSibilant();
    dispatchProps.redirectHome();
  }
});

const LeaveButtonView = ({leaveRoom}) => (
  <a class="button is-primary" style={{'marginTop': '10px'}} onClick={event => leaveRoom(event)} >Leave Room</a>
);


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  mapMergeProps
)(LeaveButtonView));