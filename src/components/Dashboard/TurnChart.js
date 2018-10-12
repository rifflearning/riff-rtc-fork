import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import ChartCard from './ChartCard';
import moment from 'moment';

ReactChartkick.addAdapter(Chart);

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

  const chartDiv = (<PieChart donut={true} library={chartOptions}
                    data={r.data} colors={r.colors}
                    height="25vw" width="25vw" />);

  return (
    <ChartCard title="Speaking Time" chartDiv={chartDiv}/>
  );
};

export default TurnChart;
