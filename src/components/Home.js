import React from 'react';
import ReactDOM from 'react-dom';
import {log} from '../libs/utils';
import MakeMeetingCard from './MakeMeetingCard';
import getUserMedia from 'getusermedia';
import attachMediaStream from 'attachmediastream';
import styled, { injectGlobal, keyframes } from 'styled-components';

const Button = styled.button.attrs({
  className: 'btn waves-effect waves-light',
})`
  background-color: #93769D !important;

  &:focus {
    background-color: #A98AB5 !important;
  }
`;

const HomeSection = styled.section.attrs({
  className: 'section'
})`
  background-color: #f6f0fb;
`;

class Home extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {
    log("Dom node: ", this.bgvid);
  }

  render() {
    return (
      <HomeSection>
        <div class="columns">
          <div class="column">
            <div class="content">
              <h1> Riff is a new way to talk online. </h1>
            </div>
          </div>
          <div class="column">
            <MakeMeetingCard>
            </MakeMeetingCard>
        </div>
      </div>
    </HomeSection>
     );
  }

}

export default Home;
