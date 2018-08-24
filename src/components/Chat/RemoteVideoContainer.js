import React from 'react';
import {log} from '../../libs/utils';

class PeerVideo extends React.Component {
  constructor (props) {
    super(props);
    this.appendVideo = this.appendVideo.bind(this);
  }

  appendVideo (el) {
    console.log("appending?")
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
    console.log("rendering", this.props.peers.length, "peers....");
    return this.props.peers.map(function (peer) {
      return (<PeerVideo key={ peer.id } peer = { peer }></PeerVideo>);
    });
  };

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

export default RemoteVideoContainer;
