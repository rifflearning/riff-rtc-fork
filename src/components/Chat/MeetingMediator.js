import util from 'util';
import * as d3 from 'd3';
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Mediator from '../../libs/charts';
import { app, socket} from "../../riff";


//import Mediator from '../libs/charts';

// state needed:
// - participants
// - transition objects
// - turn objects

const mapStateToProps = state => ({
  h: '300px',
  w: '300px',
  participantNodeRadius: 20,
  turns: state.riff.turns,
  transitions: state.riff.transitions,
  user: state.auth.user,
  roomName: state.chat.roomName,
  riffParticipants: state.riff.participants,
  riff: state.riff
});

const mapDispatchToProps = dispatch => ({
});

class MeetingMediator extends Component {

  componentDidUpdate() {
    // we need to make sure meeting mediator updates when
    // our participants change
    // in the future this can be handled by state
    if (this.mm) {
      this.mm.update_users(this.props.riffParticipants);
    }
  }

  componentDidMount() {
    const context = this.setContext();
    this.chartBody = this.setChartBody(context);
    this.graphG = this.setGraphG(this.chartBody);
    this.setOutline(this.chartBody);

    this.linksG = this.setLinksG(this.graphG);
    this.nodesG = this.setNodesG(this.graphG);
    console.log("participants:", this.props.riffParticipants);
    console.log("riffstate:", this.props.riff)
    this.startMM();
  }

  startMM() {
    this.mm = new Mediator(
      app,
      this.props.riffParticipants,
      this.props.user.uid,
      this.props.roomName
    );
  }

  setContext() {
    return d3.select(this.refs.arc).append('svg')
      .attr('height', this.props.h)
      .attr('width', this.props.w)
      .attr('id', 'mm')
      .append('g')
      .attr("transform", util.format("translate(%d, %d)", this.props.w/2, this.props.h/2));
  }

  setChartBody(context) {
    return context.append("g")
      .attr("width", this.props.w)
      .attr("height", this.props.h);
  }

  setGraphG(chartBody) {
    return chartBody.append("g")
      .attr("width", this.props.w)
      .attr("height", this.props.h);
  }

  setOutline(chartBody) {
    return chartBody.append("g")
      .attr("id", "outline")
      .append("circle")
      .style("stroke", "#AFAFAF")
      .attr("stroke-width", 3)
      .style("stroke-dasharray", ("10, 5"))
      .attr("fill", "transparent")
      .attr("r", this.props.radius + this.props.participantNodeRadius + 2);
  }

  setLinksG(graphG) {
    graphG.append("g")
      .attr("id", "links");
  }

  setNodesG(graphG) {
    graphG.append("g")
      .attr("id", "nodes");
  }

  nodeGsEnter() {
    //TODO
  }

  render() {
    return (
      <div id = "meeting-mediator">
        <p> transitions: {this.props.transitions}</p>
        <div id="meeting-mediator"></div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingMediator);
