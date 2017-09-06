import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {getUrlParam} from "./libs/utils"

if (!window.user_data) {
  window.user_data = {};
}

let user = getUrlParam("user") || window.user_data.user_id || window.prompt("Please enter a username!","name");
let room = getUrlParam("room") || window.prompt("Please enter a room name!","room");

ReactDOM.render(<App user = {user} room = {room} />, document.getElementById('rtc-container'));
//registerServiceWorker();
