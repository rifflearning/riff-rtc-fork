import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var opts = {
      // this will be made specificiable 
      roomname : this.props.user_data.room,
      username: this.props.user_data.user_id,
      name: this.props.user_data.name,
      email: this.props.user_data.email
    }
    var localVideoId = "local-video";
    return (
      <div className = "rtc-container">
        <WebRtc options = {opts} id = {localVideoId} />
      </div>
      );
  };
}


export default App;
