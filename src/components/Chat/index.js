import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import styled, { injectGlobal, keyframes } from 'styled-components';
import auth from "../../firebase";
import sibilant from 'sibilant-webaudio';
import RemoteVideoContainer from "./RemoteVideoContainer";
import {
  setWebRtcConfig,
  joinWebRtc}
from "../../redux/actions/chat";
import { push } from 'connected-react-router';
import addWebRtcListeners from "../../redux/listeners"


const mapStateToProps = state => ({
  user: state.auth.user,
  joiningRoom: state.chat.joiningRoom,
  inRoom: state.chat.inRoom,
  roomName: state.chat.roomName,
  webRtc: state.chat.webRtc,
  // first element is often null, I don't know why
  webRtcPeers: state.chat.webRtcPeers[0] === null ? [] : state.chat.webRtcPeers,
  volume: Math.ceil((80 + state.chat.volume)/20)*20,
  chat: state.chat
});

const mapDispatchToProps = dispatch => ({
  joinWebRtc: (localVideoRef, nick) => {
    dispatch(joinWebRtc(localVideoRef, nick));
  },
  dispatch: dispatch,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  withRef: true
});


const RenderVideos = ({inRoom, webRtcPeers}) => {
  if (inRoom) {
    return (
      <div class="column">
        <RemoteVideoContainer ref = "remote" peers = {webRtcPeers}/>
      </div>
    );
  } else {
    // not in room yet, we're doing our audio/video tests
    return (
      <div class="column">
        <h1> Test your mic and video!</h1>
      </div>
    );
  }
}

class Chat extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    let localVideo = ReactDOM.findDOMNode(this.refs.local);
    addWebRtcListeners(this.props.user.email,
                       localVideo,
                       this.props.dispatch,
                       this.props.chat);
    console.log("localVideo:", localVideo);
    //this.props.joinWebRtc(localVideo, this.props.user.email);
  }

  render () {
    return (
      <div class="section">
        <div class="columns">
          <aside class="menu">
            <p class="menu-label">
              {this.props.roomName}
            </p>
            <video className = "local-video"
                   id = 'local-video'
                   // this is necessary for thumos. yes, it is upsetting.
                   height = "225" width = "300"
                   ref = "local" >
              <canvas id = "video-overlay"
                      height = "225" width = "300">
              </canvas>
            </video>
            <p class="menu-label">{this.props.user.email}</p>
            <progress class="progress is-success" value={this.props.volume} max="100"></progress>
          </aside>
          <RenderVideos inRoom={this.props.inRoom} webRtcPeers={this.props.webRtcPeers}></RenderVideos>
        </div>
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat);
