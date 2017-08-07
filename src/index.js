import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import getUrlParam from "./libs/utils"


let user = getUrlParam("user");
let room = getUrlParam("room");
ReactDOM.render(<App user = {user} room = {room} />, document.getElementById('rtc-container'));
registerServiceWorker();
