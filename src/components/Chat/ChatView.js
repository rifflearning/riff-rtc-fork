import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const ChatView = ({user, roomName}) => (
  <div class="section">
    <div class="columns">
    <aside class="menu">
      <p class="menu-label">
        General
      </p>
      <video className = "local-video"
             id = 'local-video'
             // this is necessary for thumos. yes, it is upsetting.
             height = "225" width = "300"
             ref = "local" >
      </video>
      <canvas id = "video-overlay"
              height = "225" width = "300">
      </canvas>
      <ul class="menu-list">
        <li><a>Dashboard</a></li>
        <li><a>Customers</a></li>
      </ul>
    </aside>
    <div class="column">
      <p>{user.email}</p>
      <p >room name: {roomName}</p>
    </div>
  </div>
</div>
)

export default ChatView;
