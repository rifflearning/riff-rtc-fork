import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';
import Home from './Home';

import styles from './App.css';

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
        <nav class="nav-wrapper transparent z-depth-0" role="navigation">
          <Link to="/home">
            <img className={styles.brandImg} src={require('../../assets/rifflogo.jpeg')}>
            </img>
          </Link>
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

        <footer className="page-footer darken-1 no-margin-top no-padding-top transparent">
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
