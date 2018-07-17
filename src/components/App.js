import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';
import Home from './Home';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var opts = {
      // this will be made specificiable 
      roomname : "roomname",
      username: "username",
      name: "a name",
      email: "an email"
    };

    var localVideoId = "local-video";
    return (
      <div>
        <title>Chat | Rhythm RTC</title>
        <nav class="nav-wrapper light-blue lighten-1" role="navigation">
          <a id="logo-container" href="" class="brand-logo">Rhythm</a>
          <ul id="nav-mobile" class="right">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/room">Chat</Link></li>
          </ul>
        </nav>
        <main>
          <Route path="/home" component={Home}/>
          <Route path="/room"
                 render={(props) => <WebRtc {...props} options={opts} id={localVideoId}/>}
            />
        </main>

        <footer className="page-footer orange darken-1 no-margin-top no-padding-top">
          <div className="footer-copyright">
            <div className="container">
              © 2017
            </div>
          </div>
        </footer>
      </div>
    );
  };
}


export default App;
