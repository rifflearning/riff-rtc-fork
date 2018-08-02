import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBarView from "./NavBarView";
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
})

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarView));
