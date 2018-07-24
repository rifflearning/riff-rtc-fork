import React from 'react';
import ReactDOM from 'react-dom';
import WebRtc from './WebRtc';
import Home from './Home';
import history from '../history'
import styled, { injectGlobal, keyframes } from 'styled-components';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

const GradientCard = styled.div.attrs({
  className: 'card'
})`
background: linear-gradient(30deg, rgba(138,106,148,1) 12%, rgba(171,69,171,1) 87%);
border-radius: 5px;
.card-content p {
  color: #fff;
}
`
// linear-gradient(30deg, rgba(84,48,96,1) 20%, rgba(138,106,148,1) 50%, rgba(229,178,245,1) 100%);
//linear-gradient(66deg, rgba(70,19,85,1) 0%, rgba(138,106,148,1) 69%, rgba(201,155,215,0.9) 100%);

const TextInputStart = styled.a.attrs({
  className: 'button is-static'
})`
background-color: #fff;
border-color: #fff;
margin-left: 1px;
`

class MakeMeetingCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {roomName: 'example-room'};
    this.handleChange = this.handleChange.bind(this);
    this.goToChat = this.goToChat.bind(this);
  }

  goToChat (e) {
    e.preventDefault();
    console.log("room name is:", this.state.roomName);
    this.props.history.push(util.format('/room/%s', this.state.roomName));
  }

  handleChange (e) {
    console.log("Handling change: ", e);
    this.setState({roomName: event.target.value});
  }

  render() {
    return(
      <GradientCard>
        <div class="card-content">
          <p class="title">
            Start a room to make your meetings actually engaging.
          </p>
          <div class="field has-addons">
            <p class="control">
              <TextInputStart>
                riff.com/
              </TextInputStart>
            </p>
            <div class="control">
              <input class="input" type="text" value={this.state.value} onChange={this.handleChange}/>
            </div>
            <div class="control">
              <a class="button is-primary" onClick={this.goToChat}>
                Go
              </a>
            </div>
          </div>
        </div>
      </GradientCard>
    )
  }
}

export default MakeMeetingCard;
