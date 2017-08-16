import React from 'react';
import ReactDOM from 'react-dom';
import SimpleWebRTC from 'simplewebrtc';
import RemoteVideoContainer from './RemoteVideoContainer';
import Sibilant from 'sibilant-webaudio';
import feathers from 'feathers-client';
import authentication from 'feathers-authentication/client';
import captureSpeakingEvent from './libs/audio';
import io from 'socket.io-client';
import cookie from 'react-cookie';
import Mediator from './libs/charts';
import MuteButton from './MuteButton';
require('dotenv').config()


class WebRtc extends React.Component {

  constructor(props) {
    super(props);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.readyToCall = this.readyToCall.bind(this);
    this.state = {
      peers: [],     
      muted: false
    }

    this.connectToServer();

    this.server_email = process.env.REACT_APP_SERVER_EMAIL;
    this.server_password = process.env.REACT_APP_SERVER_PASSWORD;
    this.signalmaster_url = process.env.REACT_APP_SIGNALMASTER_URL;
  }

  connectToServer() {
    // we create our socket + initialize our feathers app with it
    this.socket = io(process.env.REACT_APP_SERVER_URL, {
      'transports': [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
      ]
    })

    this.app = feathers()
      .configure(feathers.hooks())
      .configure(feathers.socketio(this.socket))
      .configure(authentication());
  }

  componentDidMount() {
    this.webrtc = new SimpleWebRTC({
      localVideoEl: ReactDOM.findDOMNode(this.refs.local),
      remoteVideosEl: "", // handled by our component
      autoRequestMedia: true,
      url : this.signalmaster_url,
      nick: this.props.options.username,
      debug : false, 
    });

    // register our webrtc functions with the corresponding events
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);

    console.log("webrtc component mounted");
  }

  componentDidUpdate() {
    if (this.mm) {
      this.mm.update_users(this.getParticipants());
    }
  }

  addVideo(video, peer) {
    console.log('adding video', peer);
    // we let the child component handle the dirty work
    this.setState(function(state) {
      return {
        peers: state.peers.concat(peer)
      }
    })
  }

  removeVideo(video, peer) {
    // remove the peer from state,
    // our child component will handle it automatically
    
    // check to make sure we weren't called erroneously
    if (!peer) {
      return;
    }

    this.setState(function(state) {
      // find the peer in the array and remove it
      for (var i=0; i < state.peers.length; i++) {
        if (peer.id === state.peers[i].id) {
          state.peers.remove(i);
          break;
        }
      }
      return {
        peers: state.peers
      }
    })

    console.log('video removed ', peer);
  }

  getUser() {
    return this.props.options.username;
  }

  getRoomname() {
    return this.props.options.roomname
  }

  recordMeetingJoin() {
    // transform participants to fit the required
    // format of the rhythm-server
    let parts = this.getParticipants().map(
        (user) => { return { "participant": user } });
    
    return this.socket.emit('meetingJoined', {
      participant: this.getUser(),
      name: this.getUser(),
      participants: parts,
      meeting: this.getRoomname(),
      meetingUrl: window.location.href,
      consent: true,
      consentDate: new Date().toISOString(),
      token: this.token
    })
  }

  getLocalStream() {
    // this is gross. but, it seems simplewebrtc doesn't 
    // support getting the local stream with its API
    // please forgive me for my sins
    // we need this to hook in the audio/video data collection
    return this.webrtc.webrtc.localStreams[0];
  }

  readyToCall() {
    console.log("ready");
    this.webrtc.joinRoom(this.props.options.roomname);
    // we do this after joinRoom to be sure the stream exists
    // set threshold to appropriate value
    this.speakingEvents = new Sibilant(this.getLocalStream(), {passThrough: false, threshold: -35});
    this.authenticateAndRecord()
  }


  getParticipants() {
    let parts = this.state.peers.map(peer => peer.nick);
    parts.push(this.getUser());
    return parts;
    
  }

  getInfo() {
    return { 
      'username': this.props.options.username, 
      'roomname': this.props.options.roomname,
      'token': this.token
    };
  }
  startMM() {
    this.mm = new Mediator(
        this.app,
        this.getParticipants(),
        this.getUser(),
        this.getRoomname()
    );
  }

  authenticateAndRecord() {
    /**
     * Authenticate w/ the Rhythm server and, on success,
     * begin recording events and offloading to server
     */
    this.app.authenticate({
      type: 'local',
      email: this.server_email,
      password: this.server_password,
    }).then(function (result) {
      console.log("auth result!: ", result);
      this.token = result.token;
      return this.recordMeetingJoin();
    }.bind(this)).catch(function (err) {
      console.log('ERROR:', err);
    }).then(function (result) {
      console.log('meeting result:', result);
      // we've confirmed auth - start communication w/ server
      this.speakingEvents.bind(
        'stoppedSpeaking', 
        captureSpeakingEvent(this.app, this.getInfo())
      );
      this.startMM();
      //
      // face.startTracking($scope);
    }.bind(this));
  }

  mute() {
    this.webrtc.mute();
    console.log("muted!");
  }

  unmute() {
    this.webrtc.unmute();
    console.log("unmuted!");
  }

  muteClick() {
    if (this.state.muted) {
      this.unmute();
    } else {
      this.mute();
    }

    this.setState(function(state) {
      return {
        peers: state.peers,
        muted: !state.muted
      }
    });
  }

  render() {
    return (<div className = "row no-margin-bottom"> 
              <div id = "sidebar" className = "col s3">
                <video className = "local-video"
                  id = {this.props.id}
                  ref = "local" > 
                </video > 
                <MuteButton onClick={this.muteClick.bind(this)} muted={this.state.muted}/>
                <div id ="meeting-mediator"  />
              </div>
              <RemoteVideoContainer ref = "remote" peers = {this.state.peers}/>
            </div >
        );
  }
}

// utility function to remove elements from an array
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

export default WebRtc
