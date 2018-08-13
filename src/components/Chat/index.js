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
  joinedRoom,
  leaveRoom}
from "../../redux/actions/chat";
import { push } from 'connected-react-router';
import addWebRtcListeners from "../../redux/listeners";


const mapStateToProps = state => ({
  user: state.auth.user,
  joiningRoom: state.chat.joiningRoom,
  inRoom: state.chat.inRoom,
  roomName: state.chat.roomName,
  readyToCall: state.chat.readyToCall,
  mediaError: state.chat.getMediaError,
  webRtc: state.chat.webRtc,
  // first element is often null, I don't know why
  webRtcPeers: state.chat.webRtcPeers[0] === null ? [] : state.chat.webRtcPeers,
  volume: Math.ceil(((85 + state.chat.volume)+1)/20)*20,
  //volume: state.chat.inRoom ? 0 : Math.ceil((80 + state.chat.volume)/20)*20,
  chat: state.chat
});

const mapDispatchToProps = dispatch => ({
  leaveRoom: () => {
    dispatch(leaveRoom());
  },
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
    return (
      <div class="column">
      </div>
    );
  }
}

const VideoPlaceholder = styled.div.attrs({
  className: 'has-text-centered',
  ref: 'local'
})`
background: linear-gradient(30deg, rgba(138,106,148,1) 12%, rgba(171,69,171,1) 87%);
position: fixed;
margin-top: -175px;
width: 250px;
height: 175px;
border-radius: 5px;
display: flex;
align-items: center;
color: #fff;
padding: 5px;
`;

class Chat extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    let localVideo = ReactDOM.findDOMNode(this.refs.local);
    console.log(this.props);
    console.log("ADDING WEBRTC LISTENER")
    this.webrtc = addWebRtcListeners(this.props.user.email,
                                     localVideo,
                                     this.props.dispatch,
                                     this.props.chat); 
    console.log("localVideo:", localVideo);
    //this.props.joinWebRtc(localVideo, this.props.user.email);
  }

  componentWillUnmount() {
    this.props.leaveRoom();
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
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
                   height = "175" width = "250"
                   ref = "local" >
              <canvas id = "video-overlay"
                      height = "175" width = "250">
              </canvas>
            </video>
            {this.props.mediaError &&
              <VideoPlaceholder>
                  <p> Can't see your video? Make sure your camera is enabled.
                    </p>
                </VideoPlaceholder>}
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



export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat));
