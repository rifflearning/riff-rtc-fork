import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';

const NetworkChart = ({processedNetwork}) => {
  console.log("data for network:", processedNetwork);

  // const chartOptions = {
  //   tooltips: {
  //     callbacks: {
  //       label: function (tooltipItem, data) {
  //         let label = data.labels[tooltipItem.index] || '';
  //         let seconds = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || -1;
  //         let minutes = Math.trunc(seconds / 60);
  //         seconds = Math.round(seconds % 60);

  //         let tooltip = `${label}${label ? ': ' : ''}${minutes}m ${seconds}s`;
  //         return tooltip;
  //       }
  //     }
  //   }
  // };

  return (
    <Sigma graph={processedNetwork}
           settings={{drawEdges: true, clone: false}}>
      <RelativeSize initialSize={10}/>
      <RandomizeNodePositions/>
    </Sigma>
  );
};

export default NetworkChart;
