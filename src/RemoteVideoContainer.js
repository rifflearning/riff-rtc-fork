import React from 'react';
import includes from 'lodash/includes';

class RemoteVideoContainer extends React.Component {
  constructor(props) {
    super(props);
    // i don't like this, but it's easy
    // said the person who made every bad decision ever
    this.addingVideo = true;
  }


  videos() {
    // there may be a more elegant way to do this
    // but i can't think of it in < 3 minutes
    let peerLen = this.props.peers.length;
    let colVal;
    if (peerLen <= 1) {
      colVal = "s12";
    } else if (peerLen < 5) {
      colVal = "s6";
    } else {
      colVal = "s4";
    }
    
    return this.props.peers.map(function(peer) {
      return (
        <div className = {"col videoContainer " + colVal} id = {"container_" + peer.id}>
        </div>
      );
    });
  } 

  
  componentWillUpdate(nextProps, nextState) {
    // check to see if we're adding a video to know how to manipulate the DOM
    this.addingVideo = nextProps.peers.length > this.props.peers.length;
    
    // OK SO THIS IS GROSS BUT SIMPLEWEBRTC REQUIRES DOM MANIPULATION
    if (!this.addingVideo) {
      // convert to array of IDs for easier manipulation
      let currentPeerList = nextProps.peers.map((peer) => peer.id);
      let newPeerList = this.props.peers.map((peer) => peer.id);

      //remove the missing stream(s) from the DOM
      newPeerList.forEach(function(peer) {
        if (!includes(currentPeerList, peer)) {
          let container = document.getElementById("container_" + peer);
          // just in case, we iterate
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      });

    }
  }

  componentDidUpdate() {
    // this is not very react-y but afaik the only way to get this to work
    // after we add the containers to the DOM via the react state change,
    // we have to attach the videos to their respective containers
    if (this.addingVideo) {
      this.props.peers.map(function(peer) {
        // the container we added
        let container = document.getElementById('container_' + peer.id);
        let video = peer.videoEl;
        container.appendChild(video);
        // suppress contextmenu
        video.oncontextmenu = function() {
          return true;
        };
      });
    }


  }
  render() {
    return (
      <div className = "remotes col s9" id = "remoteVideos">
        <div ref = "remotes" className = "row"> 
          {this.videos()}
        </div>
      </div> 
    );
  }

}

export default RemoteVideoContainer
