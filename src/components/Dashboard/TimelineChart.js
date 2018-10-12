import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import {Sigma, SigmaEnableWebGL,
        RandomizeNodePositions,
        RelativeSize,
        EdgeShapes, NodeShapes,
       } from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';
import lifecycle from 'react-pure-lifecycle';
import _ from 'underscore';
import Gantt from './gantt';

const colorYou = '#ab45ab';
const colorOther = '#bdc3c7';
let peerColors = ['#f56b6b', '#128EAD', '#7caf5f', '#f2a466'];

const componentDidMount = (props) => {
  const {processedTimeline, participantId} = props;
  const {utts, participants, startTime, endTime} = processedTimeline;

  // create map of id: name
  let participants2 = _.sortBy(participants, "id");
  console.log("sorted participants:", participants2);
  let participantNames = _.pluck(participants2, "name");
  let participantIds = _.pluck(participants2, "id");
  let participantMap = _.object(participantIds, participantNames);

  const getColor = (pId) => {
    let color = peerColors[participantIds.indexOf(pId)];
    if (color == undefined) {
      color = colorOther;
    }
    return color;
  };
  // create extra key 'taskName' detailing name of speaker
  let utts2 = _.map(utts, (u) => {
    return {...u,
            taskName: participantMap[u.participant],
            color: u.participant == participantId ? colorYou : getColor(u.participant)};
  });
  var gantt = Gantt()
      .taskTypes(participantNames);
  gantt(utts2);
};

const componentDidUpdate = (props) => {
  console.log("component updating...");
}

const methods = {
  componentDidUpdate,
  componentDidMount
};

const WaveDiv = styled.div`
background-color: rgb(138,106,148)
&::before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        background-repeat: repeat;
        height: 10px;
        background-size: 20px 20px;
        background-image:
        radial-gradient(circle at 10px -5px, transparent 12px, maroon 13px);
      }
`;

// processedTimeline:
// processedUtterances: [list of utterances...]
// participants: [{id, name, ...}, ...]
const TimelineView = ({processedTimeline, participantId}) => {
  return (
    <React.Fragment>
      <WaveDiv>
        <div id="gantt"></div>
      </WaveDiv>
    
    </React.Fragment>
  );
}

const TimelineChart = lifecycle(methods)(TimelineView);

export default TimelineChart;
