import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import styled, { injectGlobal, keyframes } from 'styled-components';
import auth from "../../firebase";
import {
  setWebRtcConfig,
  joinWebRtc}
from "../../redux/actions/chat";
import { push } from 'connected-react-router';
import ChatView from './ChatView';

const mapStateToProps = state => ({
  user: state.auth.user,
  joiningRoom: state.chat.joiningRoom,
  inRoom: state.chat.inRoom,
  roomName: state.chat.roomName
});

const mapDispatchToProps = dispatch => ({
  dispatchWebRtcConfig: (localVideoRef, email) => {
    dispatch(setWebRtcConfig(localVideoRef, email));
  },
  joinWebRtc: (localVideoRef, nick) => {
    dispatch(joinWebRtc(localVideoRef, nick));
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  withRef: true
})

class Chat extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    let localVideo = ReactDOM.findDOMNode(this.refs.local);
    this.props.joinWebRtc(localVideo, this.props.user.email);
  }

  render () {
    return (
      <div class="section">
        <div class="columns">
          <aside class="menu">
            <p class="menu-label">
              General
            </p>
            <video className = "local-video"
                   id = 'local-video'
                   // this is necessary for thumos. yes, it is upsetting.
                   height = "225" width = "300"
                   ref = "local" >
            </video>
            <canvas id = "video-overlay"
                    height = "225" width = "300">
            </canvas>
            <ul class="menu-list">
              <li><a>Dashboard</a></li>
              <li><a>Customers</a></li>
            </ul>
          </aside>
          <div class="column">
            <p>{this.props.user.email}</p>
            <p >room name: {this.props.roomName}</p>
          </div>
        </div>
      </div>
    )
  }
}



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat);
