import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';
import Home from './Home';
import SignUp from "./SignUp"
import NavBar from "./NavBar"
import styled, { injectGlobal, keyframes } from 'styled-components';
import store from '../redux/store'
import { withRouter } from "react-router-dom"
import {
  Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router';

import browserHistory from "../history"

const Footer = styled.footer.attrs({
  className: 'footer'
})`
  background-color: #f6f0fb;
`

// App component
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
        <title>Riff</title>
        <Router history={browserHistory}>
          <div>
            <NavBar>
            </NavBar>
            <Route path="/home" component={Home}/>
            <Route path="/room/:roomname" render={(props) => <WebRtc {...props} options={opts} id={localVideoId}/>}></Route>
            <Route exact path="/signup" component={SignUp} />
          </div>
        </Router>
      </div>
    );
  };
}

export default App;
