import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBarView from "./NavBarView";
import { connect } from 'react-redux'

import { logOutUser } from '../../redux/actions/auth'

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
})

const mapDispatchToProps = dispatch => ({
  handleLogOut: (event) => {
    dispatch(logOutUser());
  }
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarView));
