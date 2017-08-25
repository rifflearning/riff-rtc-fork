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
import log from './libs/utils';
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


    // rssi value over which we will consider a speaking event
    this.THRESHOLD = -35;
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

    log("webrtc component mounted");
  }

  componentDidUpdate() {
    if (this.mm) {
      this.mm.update_users(this.getParticipants());
    }
  }

  addVideo(video, peer) {
    log('adding video', peer);
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

    log("removing peer: " + peer.id);
    this.setState(function(state) {
      // find the peer in the array and remove it
      return {
        peers: state.peers.filter((x) => x.id !== peer.id)
      }
    });

    log('video removed ', peer);
  }

  getUser() {
    return this.props.options.username;
  }

  getRoomname() {
    return this.props.options.roomname
  }

  getName() {
    return this.props.options.name || this.getUser();
  }

  recordMeetingJoin() {
    // transform participants to fit the required
    // format of the rhythm-server
    let parts = this.getParticipants().map(
        (user) => { return { "participant": user } });
    
    return this.socket.emit('meetingJoined', {
      participant: this.getUser(),
      name: this.getName(),
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
    log("ready");
    this.webrtc.joinRoom(this.props.options.roomname);
    // we do this after joinRoom to be sure the stream exists
    // set threshold to appropriate value
    this.speakingEvents = new Sibilant(this.getLocalStream(), {passThrough: false, threshold: this.THRESHOLD});
    // authenticate, and, on sucess, call record()
    this.authenticate(this.record);
  }


  getParticipants() {
    let parts = this.state.peers.map(peer => peer.nick);
    parts.push(this.getUser());
    return parts;
    
  }

  getInfo() {
    return { 
      'username': this.getUser(), 
      'roomname': this.getRoomname(),
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

  record() {
    // begin tracking user events and sending them to server
    this.speakingEvents.bind(
      'stoppedSpeaking', 
      captureSpeakingEvent(this.app, this.getInfo())
    );
    this.startMM();
    //face.startTracking($scope);

  }

  authenticate(callback) {
    /**
     * Authenticate w/ the Rhythm server and, on success,
     * begin recording events and offloading to server
     *
     * Calls the given function upon auth success
     */
    this.app.authenticate({
      type: 'local',
      email: this.server_email,
      password: this.server_password,
    }).then(function (result) {
      log("auth result!: ", result);
      this.token = result.token;
      return this.recordMeetingJoin();
    }.bind(this)).catch(function (err) {
      log('ERROR:', err);
    }).then(function (result) {
      log('meeting result:', result);
      // we've confirmed auth - start communication w/ server
      callback()
    }.bind(this));
  }

  mute() {
    this.webrtc.mute();
    log("muted!");
  }

  unmute() {
    this.webrtc.unmute();
    log("unmuted!");
  }

  muteClick() {
    // mute the webrtc stream and update the state
    
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
                <MuteButton onClick = {this.muteClick.bind(this)} muted = {this.state.muted}/>
                <div id = "meeting-mediator"  />
              </div>
              <RemoteVideoContainer ref = "remote" peers = {this.state.peers}/>
            </div >
        );
  }
}

export default WebRtc
