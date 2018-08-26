import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import styled, { injectGlobal, keyframes } from 'styled-components';
import auth from "../../firebase";
import sibilant from 'sibilant-webaudio';
import RemoteVideoContainer from "./RemoteVideoContainer";
import MeetingMediator from "./MeetingMediator";
import MaterialIcon from 'material-icons-react';
import {
  setWebRtcConfig,
  joinWebRtc,
  joinedRoom,
  leaveRoom,
  muteAudio,
  unMuteAudio,
  changeRoomName,
  changeDisplayName,
  joinRoomError,
  clearJoinRoomError}
from "../../redux/actions/chat";
import { participantLeaveRoom } from '../../redux/actions/riff';
import { push } from 'connected-react-router';
import addWebRtcListeners from "../../redux/listeners";
import { riffAddUserToMeeting } from '../../redux/actions/riff';
import { store, persistor } from '../../redux/store';


const mapStateToProps = state => ({
  user: state.auth.user,
  joiningRoom: state.chat.joiningRoom,
  inRoom: state.chat.inRoom,
  roomName: state.chat.roomName,
  readyToCall: state.chat.readyToCall,
  mediaError: state.chat.getMediaError,
  joinRoomError: state.chat.joinRoomError,
  webRtc: state.chat.webRtc,
  displayName: state.chat.displayName,
  // first element is often null, I don't know why
  webRtcPeers: state.chat.webRtcPeers[0] === null ? [] : state.chat.webRtcPeers,
  isAudioMuted: state.chat.audioMuted,
  volume: Math.ceil(((85 + state.chat.volume)+1)/20)*20,
  chat: state.chat,
  auth: state.auth,
  riff: state.riff,
  state: state
});

const mapDispatchToProps = dispatch => ({
  leaveRoom: () => {
    dispatch(leaveRoom());
  },

  leaveRiffRoom: (meetingId, uid) => {
    participantLeaveRoom(meetingId, uid);
  },
  clearJoinRoomError: () => {
    dispatch(clearJoinRoomError());
  },
  handleRoomNameChange: (roomName) => {
    dispatch(changeRoomName(roomName));
  },
  handleDisplayNameChange: (displayName, webrtc) => {
    webrtc.changeNick(displayName);
    dispatch(changeDisplayName(displayName));
  },
  joinWebRtc: (localVideoRef, nick) => {
    dispatch(joinWebRtc(localVideoRef, nick));
  },
  handleReadyClick: (event, name, chat, auth, riff, webrtc) => {
    if ((chat.roomName == '' || chat.displayName == '')) {
      dispatch(joinRoomError('You need to specify a room and a display name!'));
    } else {
      event.preventDefault();
      webrtc.stopVolumeCollection();
      webrtc.joinRoom(chat.roomName, function (err, rd) {
        console.log(err, "---", rd);
      });

      console.log("Clicked Ready to Join");
      console.log('webrtc object:', webrtc);
      dispatch(joinedRoom(name));
      riffAddUserToMeeting(auth.user.uid,
                           auth.user.email ? auth.user.email : "",
                           chat.roomName,
                           chat.displayName,
                           chat.roomName,
                           chat.webRtcPeers,
                           riff.authToken
                          );
    }
  },
  handleMuteAudioClick: (event, muted, webrtc) => {
    console.log(event, muted);
    if (muted) {
      dispatch(unMuteAudio());
      webrtc.unmute();
    } else {
      dispatch(muteAudio());
      webrtc.mute();
    }

  },
  dispatch: dispatch,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  withRef: true
});


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

const ErrorNotification = styled.div.attrs({
  className: 'notification is-warning'
})`
max-width: 15.5rem;
margin-top: 10px;
`;

const RenderVideos = ({inRoom, webRtcPeers}) => {
  //console.log("webrtc peers:", webRtcPeers);
  if (webRtcPeers.length > 0) {
    return (
      <div class="column">
        <RemoteVideoContainer ref = "remote" peers = {webRtcPeers}/>
      </div>
    );
  } else {
    return (
      <div class="column has-text-centered">
        {!inRoom ? <h1>Waiting for you to be ready...</h1> : <h1>Nobody else here...</h1>}
      </div>
    );
  }
}

class Chat extends Component {
  constructor (props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onUnload = this.onUnload.bind(this);
  }

  componentDidUpdate() {
    //console.log(this.props.joinRoomError);
    // console.log(!(this.props.roomName == '' && this.props.chat.displayName == ''));
    // console.log(this.props.roomName);
    // console.log(this.props.chat.displayName);
  }

  componentDidMount() {
    let localVideo = ReactDOM.findDOMNode(this.refs.local);
    this.webrtc = addWebRtcListeners(this.props.user.email,
                                     localVideo,
                                     this.props.dispatch,
                                     store.getState);

    // leave chat when window unloads
    window.addEventListener("beforeunload", this.onUnload);
  }

  onUnload(event) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>UNLOADING!", event, this.props.riff.meetingId);
    this.props.leaveRiffRoom(this.props.riff.meetingId,
                             this.props.user.uid);
    this.props.leaveRoom();
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
    this.webrtc.stopSibilant();
    if (event) {
      this.props.leaveRiffRoom(this.props.riff.meetingId,
                               this.props.user.uid);
      event.preventDefault()
      console.log("event:", event)
      event.returnValue = "If you leave, you'll have to re-join the room.";
      return event.returnValue;
    }
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.props.handleReadyClick(event, this.name, this.props.chat, this.props.auth, this.props.riff, this.webrtc);
    }
  }

  componentWillUnmount() {
    this.onUnload();
    window.removeEventListener('beforeunload', this.onUnload);
  }

  render () {
    return (
      <div class="section">
        <div class="columns">
          <aside class="menu">
            <p class="menu-label">
              Room: {this.props.roomName}
            </p>

            {this.props.inRoom &&
              <p class="menu-label">Name: {this.props.displayName}</p>
              }

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
              {this.props.inRoom &&
                <div class="has-text-centered">
                    <div class="control">
                        {this.props.isAudioMuted ?
                          <a class="button is-rounded is-danger"  onClick={event => this.props.handleMuteAudioClick(event, this.props.isAudioMuted, this.webrtc)}>
                              <MaterialIcon icon="mic_off"/>
                            </a>
                          :
                            <a class="button is-rounded" onClick={event => this.props.handleMuteAudioClick(event, this.props.isAudioMuted, this.webrtc)}>
                                <MaterialIcon icon="mic"/>
                              </a>  
                          }
                          </div>
                  </div>
              }
            {!this.props.inRoom ?
              <div class="has-text-centered">
                  <div class="level">
                      <div class="level-item">
                        <MaterialIcon icon="mic"></MaterialIcon>
                        </div>
                        <div class="level-item">
                            <progress class="progress is-success" value={this.props.volume} max="100"></progress>
                        </div>
                    </div>
                    <div class="control">
                        <p class="menu-label" >Room Name</p>
                        <div class="control" style={{'marginTop': '10px'}}>
                            <input class="input"
                                     type="text"
                                     name="name"
                                     placeholder="Room Name"
                                     value={this.props.roomName}
                                     onChange={event => this.props.handleRoomNameChange(event.target.value)}/>
                          </div>
                          <p class="menu-label" >Display Name</p>
                          <input class="input"
                                   type="text"
                                   name="name"
                                   placeholder="Display Name"
                                   value={this.name}
                                   onKeyPress={ this.handleKeyPress }
                                   onChange={event => this.props.handleDisplayNameChange(event.target.value, this.webrtc)}/>
                        </div>
                        <a class="button is-outlined is-primary"
                             style={{'marginTop': '10px'}}
                             disabled={(this.props.roomName == '' || this.props.displayName == '')}
                             onClick={ event => this.props.handleReadyClick(event, this.name, this.props.chat, this.props.auth, this.props.riff, this.webrtc)}>Join Room</a>
                          <div>
                              { this.props.joinRoomError &&
                                <ErrorNotification>
                                    <button class="delete" onClick={this.props.clearJoinRoomError}></button>
                                      {this.props.joinRoomError}
                                </ErrorNotification>
                              }
                          </div>
                </div>
                :
                <MeetingMediator></MeetingMediator>
            }
          </aside>
          <RenderVideos inRoom={this.props.inRoom} webRtcPeers={this.props.webRtcPeers}></RenderVideos>
        </div>
      </div>
    );
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat));
