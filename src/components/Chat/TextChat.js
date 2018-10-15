import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect, compose } from 'react-redux';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import lifecycle from 'react-pure-lifecycle';
import 'react-chat-widget/lib/styles.css';

import { sendTextChatMsg } from '../../redux/actions/textchat';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  handleNewUserMessage: (event) => {
    console.log("event:", event);
    dispatch(sendTextChatMsg("message~", "dan", "meeting"));
  },
});

const componentDidMount = (props) => {
  addResponseMessage("oooooh");
};

const methods = {
  componentDidMount
};

const ChatView = (props) => (
  <Widget handleNewUserMessage={props.handleNewUserMessage}/>
);

const Chat = lifecycle(methods)(ChatView);

export default connect(mapStateToProps,
                       mapDispatchToProps)(Chat);

