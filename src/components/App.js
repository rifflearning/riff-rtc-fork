import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import NavBar from "./NavBar";
import {ScaleLoader} from 'react-spinners';
import styled, { injectGlobal, keyframes } from 'styled-components';
import store from '../redux/store';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {
  Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router';

import browserHistory from "../history";
import firebase from "../firebase";
import addAuthListener from '../redux/listeners/auth';
import { attemptLoginAnonymous } from '../redux/actions/auth';
import { attemptRiffAuthenticate } from '../redux/actions/riff';
import { initializeLTIUser } from '../redux/actions/ltiUser';

const Footer = styled.footer.attrs({
  className: 'footer'
})`
  background-color: #f6f0fb;
`;

const LoadingView = () => {
  return (
    <div className="columns has-text-centered is-centered is-vcentered" style={{minHeight: "100vh"}}>
      <div className="column is-vcentered has-text-centered">
        <ScaleLoader color={"#8A6A94"}/>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  riff: state.riff,
//  isLoaded: false,
  isLoaded: ((state.auth.user.uid || state.auth.uid) && state.riff.authToken)
});

const mapDispatchToProps = dispatch => ({
  attemptLoginAnonymous: () => {
    attemptLoginAnonymous();
  },
  authenticateRiff: () => {
    console.log("attempt riff auth");
    dispatch(attemptRiffAuthenticate());
  },
  initializeLTIUser: (data) => {
    dispatch(initializeLTIUser(data));
  },
  dispatch: dispatch
});

// App component
class App extends React.Component {

  constructor(props) {
    super(props);
    addAuthListener(this.props.dispatch,
                    this.props.auth);
  }

  componentWillMount() {
    if (!this.props.riff.token) {
      this.props.authenticateRiff();
    }

    // if window was loaded with LTI data
    if (window.lti_data) {
      console.log("Loaded with LTI data and user.");
      this.props.initializeLTIUser(window.lti_data);
    } else if (!this.props.auth.user.uid && !this.props.auth.uid) {
      console.log("No user detected, creating anonymous ID");
      this.props.attemptLoginAnonymous();
    }
  }

  componentDidMount() {
    console.log("App component loaded.");
  }

  render() {
    var localVideoId = "local-video";
    return (
      <div>
        <title>Riff</title>
        <Router history={browserHistory}>
          <div>
            <NavBar>
            </NavBar>
            {!this.props.isLoaded ?
              <LoadingView/>
                :
                <div>
                  <Route path="(/home|.|/)" component={Home}/>
                  <Route exact path="/room" component={Chat}/>
                  <Route exact path="/signup" component={SignUp} />
                  <Route exact path="/login" component={LogIn} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/riffs" component={Dashboard} />
                </div>
                }
          </div>
        </Router>
      </div>
    );
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
