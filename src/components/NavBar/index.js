import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBarView from "./NavBarView";
import { connect } from 'react-redux';
import {OPEN_NAV_MENU, CLOSE_NAV_MENU} from '../../redux/constants/ActionTypes';
import { logOutUser } from '../../redux/actions/auth';
import { logoutLTIUser } from '../../redux/actions/lti';

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  menuOpen: state.menu.menuOpen
});

const mapDispatchToProps = dispatch => ({
  handleLogOut: (event) => {
    dispatch(logOutUser());
    dispatch(logoutLTIUser());
  },
  openMenu: () => {
    dispatch({type: OPEN_NAV_MENU});
  },
  closeMenu: () => {
    dispatch({type: CLOSE_NAV_MENU});
  }
});

const mapMergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  withRef: true,
  handleBurgerClick: (event) => {
    console.log("clicked burger!", stateProps);
    if (!stateProps.menuOpen) {
      dispatchProps.openMenu();
    } else {
      dispatchProps.closeMenu();
    }
  }
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  mapMergeProps
)(NavBarView));
