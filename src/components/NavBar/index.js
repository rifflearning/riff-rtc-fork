import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBarView from "./NavBarView";
import { connect } from 'react-redux'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarView)
//
// class NavBarContainer extends Component {
//
//   constructor(props) {
//     super(props);
//     this.state = { };
//   }
//
// }
