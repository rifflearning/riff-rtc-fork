import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';

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
max-width: 25vw;
padding-top: 0.75rem;
`;

const ChartDiv = styled.div.attrs({
  className: "card-image has-text-centered is-centered"
})`
padding-bottom: 1rem;
.sigma-scene: {
left: 0px;
}
`;


const ChartCard = ({chartDiv, title}) => {
  return (
    <Card>
      <CardTitle>{title}
        <span className="has-text-right" style={{float: 'right'}}>
          <a onClick={event => handleRefreshClick(event, user.uid)}>
            <MaterialIcon icon="info"/>
          </a>
        </span>
      </CardTitle>
      <ChartDiv>
        {chartDiv}
      </ChartDiv>
    </Card>
  );
};

export default ChartCard;
