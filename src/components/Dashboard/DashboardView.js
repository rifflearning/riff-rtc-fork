import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const DashboardView = ({user, riffAuthToken}) => (
  <div class="columns">
    <div class="column">
      <p>{riffAuthToken}</p>
      <p>Hiiii Dashboard</p>

    </div>
  </div>
);

export default DashboardView;
