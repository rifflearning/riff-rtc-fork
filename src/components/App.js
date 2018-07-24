import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';
import Home from './Home';
import styled, { injectGlobal, keyframes } from 'styled-components';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';


// Styling
// #  min-width: 3.75rem;
// #  max-height: 80%;
const Brandimg = styled.img`
  width: 63px;
  height: 50px;
`;

const NavBar = styled.nav.attrs({
  className: 'navbar is-transparent'
})`
  background-color:rgba(255, 255, 255, 0.1);
  min-height: 3.25rem;
  .navbar-item img {
    max-height: 100%;
  }
`;

const NavItem = styled.a.attrs({
  className: 'navbar-item'
})`

`

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
        <NavBar role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="/home">
            <Brandimg src={require('../../assets/rifflogo.jpeg')}/>
            </a>
          <div class="navbar-burger burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <NavItem>
              <Link to="/home">Home</Link>
            </NavItem>
            <NavItem>
              <Link to="/room">Chat</Link>
            </NavItem>
          </div>
          <div class="navbar-end">
          </div>
        </div>
      </NavBar>
      <main>
        <Route path="/home" component={Home}/>
        <Route path="/room/:roomname"
        render={(props) => <WebRtc {...props} options={opts} id={localVideoId}/>}
      />
    </main>

    <Footer>
      <div class="content has-text-centered">
        <p>
          <strong>Riff</strong> © 2017
        </p>
      </div>
    </Footer>
  </div>
);
};
}

export default App;
