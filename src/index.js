import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {getUrlParam} from "./libs/utils";
import "./index.scss";
import 'webrtc-adapter';  // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

import history from './history';
import { AppContainer } from 'react-hot-loader';
import {store, persistor} from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';

import browserHistory from './history';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={browserHistory}>
        <App/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
