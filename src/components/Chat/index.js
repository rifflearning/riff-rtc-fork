import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import styled, { injectGlobal, keyframes } from 'styled-components';
import auth from "../../firebase";
import sibilant from 'sibilant-webaudio';
import RemoteVideoContainer from "./RemoteVideoContainer";
import MaterialIcon from 'material-icons-react';
import {
  setWebRtcConfig,
  joinWebRtc,
  joinedRoom}
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
  //volume: state.chat.inRoom ? 0 : Math.ceil((80 + state.chat.volume)/20)*20,
  chat: state.chat
});

const mapDispatchToProps = dispatch => ({
  joinWebRtc: (localVideoRef, nick) => {
    dispatch(joinWebRtc(localVideoRef, nick));
  },
  handleReadyClick: (event) => {
    event.preventDefault();
    console.log("Clicked Ready to Join");
    dispatch(joinedRoom());
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
    // TODO: implement "testing" state.
    // in this state (inRoom is false), we are letting the user test their setup.
    // other people can't see them (yet) and the user can't see others.
    // they see a progress bar, and have a button to let them continue on (changing inRoom to true)
    // easy.
    // manage this in state
    // not in room yet, we're doing our audio/video tests
    return (
      <div class="column">
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
                   height = "125" width = "200"
                   ref = "local" >
              <canvas id = "video-overlay"
                      height = "125" width = "200">
              </canvas>
            </video>
            <p class="menu-label">{this.props.user.email}</p>
            {!this.props.inRoom &&
              <div class="has-text-centered">
                  <div class="level">
                      <div class="level-item">
                        <MaterialIcon icon="mic"></MaterialIcon>
                        </div>
                        <div class="level-item">
                            <progress class="progress is-success" value={this.props.volume} max="100"></progress>
                          </div>
                    </div>
                    <a class="button is-outlined is-primary" onClick={this.props.handleReadyClick}>Ready to Chat</a>

                </div>
            }
          </aside>
          <RenderVideos inRoom={this.props.inRoom} webRtcPeers={this.props.webRtcPeers}></RenderVideos>
        </div>
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat);
