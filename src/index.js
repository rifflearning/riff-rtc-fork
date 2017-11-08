import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {getUrlParam} from "./libs/utils"


let user_data = window.user_data || {};
user_data.user_id = user_data.user_id || getUrlParam("user") || window.prompt("Please enter a username!","name");
user_data.email = user_data.email || getUrlParam("email") || window.prompt("Please enter your email!","email");
// default to user id if not provided
user_data.name = user_data.name || user_data.user_id;
user_data.room = user_data.room || getUrlParam("room") || window.prompt("Please enter a room name!","room");

ReactDOM.render(<App user_data={user_data} />, document.getElementById('rtc-container'));
//registerServiceWorker();
