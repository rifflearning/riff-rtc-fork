import React from 'react';
import {log} from '../../libs/utils';

class PeerVideo extends React.Component {
  constructor (props) {
    super(props);
    this.appendVideo = this.appendVideo.bind(this);
  }

  appendVideo (el) {
    if (el !== null) {
      let video = this.props.peer.videoEl;
      el.appendChild(video);
    }
  }

  render () {
    return (
        <div className = {"videoContainer remotes column"}
             id = {"container_" + this.props.peer.id}
             ref={this.appendVideo}>
        </div>
    );
  }
}

class RemoteVideoContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log("remote video props:", props);
  }

  videos() {
    return this.props.peers.map(function (peer) {
      return (<PeerVideo key={ peer.id } peer = { peer }></PeerVideo>);
    });
    // let peerLen = this.props.peers.length;
    // console.log("peer length:", peerLen)

    // return this.props.peers.map(function(peer) {
    //   let video = peer.videoEl;
    //   return (
    //     <div key={peer.id}
    //          className = {"videoContainer remotes column"}
    //          id = {"container_" + peer.id}
    //          ref={(nodeElement) => nodeElement.appendChild(video)}>
    //     </div>
    //   );
  };


  // componentWillUpdate(nextProps, nextState) {
  //   // OK SO THIS IS GROSS BUT SIMPLEWEBRTC REQUIRES DOM MANIPULATION
  //   // convert to array of IDs for easier manipulation
  //   //console.log("peer list:", this.props.peers);
  //   let newPeerList = nextProps.peers.map((peer) => peer.id);
  //   let currentPeerList = this.props.peers.map((peer) => peer.id);

  //   // console.log("peer list:", nextProps.peers);
  //   // log("CURRENT PEER LIST " + currentPeerList);
  //   // log("NEW PEER LIST " + newPeerList);

  //   // //    console.log("next peer list:", nextProps.peers);

  //   // currentPeerList.forEach( (peer) => {
  //   //   if (newPeerList.indexOf(peer) < 1) {
  //   //     console.log("removing container for peer", peer);
  //   //     let container = document.getElementById("container_" + peer);
  //   //     while (container.firstChild) {
  //   //       container.removeChild(container.firstChild);
  //   //     }
  //   //   }
  //   // });

  //   // remove the missing stream(s) from the DOM
  //   // currentPeerList.forEach(function(peer) {
  //   //   if (newPeerList.indexOf(peer.id) < 1) {
  //   //     console.log("removing container", "container_"+peer);
  //   //     let container = document.getElementById("container_" + peer);
  //   //     // just in case, we iterate
  //   //     while (container.firstChild) {
  //   //       container.removeChild(container.firstChild);
  //   //     }
  //   //   }
  //   // });
  // }

  // componentDidUpdate() {
  //   // this is not very react-y but afaik the only way to get this to work
  //   // after we add the containers to the DOM via the react state change,
  //   // we have to attach the videos to their respective containers
  //   // this.props.peers.map(function(peer) {
  //   //   // the container we added
  //   //   let container = document.getElementById('container_' + peer.id);
  //   //   // console.log(container.childNodes)
  //   //   // console.log(container.childNodes.length)
  //   //   if (container.childNodes.length == 0) {
  //   //     console.log("container does not have child nodes");
  //   //     console.log("Adding peer: " + peer.id + "to container container_" + peer.id);
  //   //     console.log("Peer:", peer);
  //   //     let video = peer.videoEl;
  //   //     console.log("got peer video:", video);
  //   //     container.appendChild(video);
  //   //     video.load();
  //   //     video.play();
  //   //     video.oncontextmenu = function() {
  //   //       return true;
  //   //     };
  //   //   }

  //   // });

  //   this.props.peers.map(function(peer) {
  //     peer.videoEl.play();
  //   });

  // }


  render() {
    return (
      <div className = "remotes" id = "remoteVideos">
        <div ref = "remotes" className = "columns">
          {this.videos()}
        </div>
      </div>
    );
  }

}

export default RemoteVideoContainer
