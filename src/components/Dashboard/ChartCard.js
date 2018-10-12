import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import {ScaleLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import Chart from 'chart.js';
import moment from 'moment';
import lifecycle from 'react-pure-lifecycle';
import {withReducer} from 'recompose';

const CardTitle = styled.div.attrs({
  className: "title is-5 has-text-left"
})`
margin-left: 1rem;
margin-right: 1rem;
color: rgb(138,106,148);
`;



const ChartDiv = styled.div.attrs({
  className: "card-image has-text-centered is-centered"
})`
padding-bottom: 1rem;
.sigma-scene: {
left: 0px;
}
`;

const WidthCard = (maxWidth) => {
  console.log("setting max width to:", maxWidth + "vw");
  const Card = styled.div.attrs({
    className: "card has-text-centered is-centered"
  })`
margin-left: auto;
margin-right: auto;
background-color: #f6f0fb;
border: 2px solid rgb(138,106,148);
box-shadow: none;
border-radius: 5px;
max-width: ${props => maxWidth + "vw"};
padding-top: 0.75rem;
`;
  return Card;
};


const ChartInfoDiv = styled.div`
position: absolute;
top: 0px;
left: 0px;
height: 100%;
width: 100%;
background-color: rgba(171,69,171,0.9);
z-index: 1;
`;


const INFO_CLICKED = 'INFO_CLICKED';
const chartCardReducer = (isInfoOpen, action) => {
  switch (action.type) {
  case INFO_CLICKED:
    return !isInfoOpen;
  default:
    return isInfoOpen;
  }
};

const enhance = withReducer('isInfoOpen', 'dispatch', chartCardReducer, false);

// we use redraw here for pure d3 charts (like the TimelineChart)
// since we need a way to redraw when this component re-renders/updates.
const componentDidUpdate = (props) => {
  if (props.redraw) {
    props.redraw();
  }
};

const methods = {
  componentDidUpdate
};

//const ChartCard = ({chartDiv, title, maxWidth}) => {
const ChartCard = enhance((props) => {
  let mw = props.maxWidth ? props.maxWidth : 25;
  let Card = WidthCard(mw);
  console.log("chart div:", props.chartDiv);
  return (
    <Card>
      <CardTitle>{props.title}
        <span className="has-text-right" style={{float: 'right'}}>
          <a onClick={event => props.dispatch({type: INFO_CLICKED}) }>
            <MaterialIcon icon="info"/>
          </a>
        </span>
      </CardTitle>
      {props.isInfoOpen &&
        <ChartInfoDiv>
            <span className="has-text-right" style={{float: 'right'}}>
                <a onClick={event => props.dispatch({type: INFO_CLICKED}) }>
                    <MaterialIcon icon="close"/>
                  </a>
              </span>
              <p>{props.chartInfo}</p>
          </ChartInfoDiv>}
      <ChartDiv>
          {props.chartDiv}
      </ChartDiv>
    </Card>
  );
});

export default lifecycle(methods)(ChartCard);
