import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import getUrlParam from "./libs/utils"


let user = getUrlParam("user") || window.user_data.user_id;
let room = getUrlParam("room") || window.prompt("Please enter a room name!","room");;

ReactDOM.render(<App user = {user} room = {room} />, document.getElementById('rtc-container'));
registerServiceWorker();
