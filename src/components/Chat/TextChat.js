import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect, compose } from 'react-redux';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import styled from 'styled-components';
import lifecycle from 'react-pure-lifecycle';
import _ from 'underscore';
import 'react-chat-widget/lib/styles.css';

import { sendTextChatMsg } from '../../redux/actions/textchat';

const RiffChat = styled.div`
.rcw-conversation-container > .rcw-header {
  background-color: rgb(138,106,148);
}

.rcw-message > .rcw-client {
background-color: rgb(138,106,148);
color: #fff;
}

.rcw-launcher {
background-color: rgb(138,106,148);
}
`

const mapStateToProps = state => ({
  ...state,
  messages: state.chat.textchat.messages,
  roomName: state.chat.roomName,
  badge: state.chat.textchat.badge
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

const componentDidMount = (props) => {

};

const componentDidUpdate = (props, prevProps) => {
  console.log("updating text chat component...", props.messages);
  function arrayDiff(a, b) {
    return [
      ...a.filter(x => !b.includes(x)),
      ...b.filter(x => !a.includes(x))
    ];
  }
  if (props.messages != prevProps.messages) {
    let newMessages = arrayDiff(props.messages, prevProps.messages);
    let numNewMessages = newMessages.length;
    console.log("new messages:", newMessages);
    _.each(newMessages, (m) => {
      addResponseMessage("**" + m.name + "**" + ": " + m.message);
    });
  }
}


const mapMergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleNewUserMessage: (event) => {
//    console.log("event:", event, stateProps, dispatchProps);
    dispatchProps.dispatch(sendTextChatMsg(event,
                                           stateProps.auth.user.uid,
                                           stateProps.riff.meetingId));
  }
});

const methods = {
  componentDidMount,
  componentDidUpdate
};

const ChatView = (props) => (
  <RiffChat>
  <Widget handleNewUserMessage={props.handleNewUserMessage}
          title={props.roomName}
          subtitle=""
          badge={props.numNewMessages}/>
  </RiffChat>
);

const Chat = lifecycle(methods)(ChatView);

export default connect(mapStateToProps,
                       mapDispatchToProps,
                       mapMergeProps)(Chat);

