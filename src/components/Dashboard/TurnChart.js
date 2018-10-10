import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';

ReactChartkick.addAdapter(Chart);

const CardTitle = styled.div.attrs({
  className: "title is-5 has-text-left"
})`
margin-left: 1rem;
margin-right: 1rem;
color: rgb(138,106,148);
`;

const Card = styled.div.attrs({
  className: "card has-text-centered is-centered"
})`
background-color: #f6f0fb;
border: 2px solid rgb(138,106,148);
box-shadow: none;
border-radius: 5px;
max-width: 20vw;
padding-top: 0.75rem;
`;

const ChartDiv = styled.div.attrs({
  className: "card-image has-text-centered is-centered"
})`
padding-bottom: 1rem;
`;


const formatChartData = (processedUtterances, participantId) => {
  console.log("formatting:", processedUtterances);

  const colorYou = '#ab45ab';
  const colorOther = '#bdc3c7';
  let nextOtherUser = 1;

  let data = [];
  let peerColors = ['#f56b6b', '#128EAD', '#7caf5f', '#f2a466'];
  let colors = [];
  processedUtterances = _.sortBy(processedUtterances, "participantId");

  processedUtterances.forEach(p => {
    // our display name from firebase if we've got it.
    let label = p.name;

    if (p.participantId === participantId) {
      data.unshift([ 'You', p.lengthUtterances]);
      colors.unshift(colorYou);
    }
    else {
      data.push([ label || `User ${nextOtherUser++}`, p.lengthUtterances]);
      colors.push(peerColors[nextOtherUser++ - 1]);
    }
  });

  return { data: data, colors: colors };
};

const TurnChart = ({processedUtterances, participantId}) => {
  let r = formatChartData(processedUtterances, participantId);
  console.log("data for chart:", r.data);

  const chartOptions = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.labels[tooltipItem.index] || '';
          let seconds = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || -1;
          let minutes = Math.trunc(seconds / 60);
          seconds = Math.round(seconds % 60);

          let tooltip = `${label}${label ? ': ' : ''}${minutes}m ${seconds}s`;
          return tooltip;
        }
      }
    }
  };

  return (
    <Card>
      <CardTitle>Speaking Time
        <span className="has-text-right" style={{float: 'right'}}>
          <a onClick={event => handleRefreshClick(event, user.uid)}>
            <MaterialIcon icon="info"/>
          </a>
        </span>
      </CardTitle>
      <ChartDiv>
        <PieChart donut={true} library={chartOptions}
                  data={r.data} colors={r.colors}
                  height="20vw" width="20vw" />
      </ChartDiv>
    </Card>
  );
};

export default TurnChart;
