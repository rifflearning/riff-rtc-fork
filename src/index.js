import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';  // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';

// TODO: WHY? If this isn't here, video chat crashes when someone joins!
//       And yet as far as I can tell this package is only supposed to be used
//       for development. -mjl 2018-10-15
import 'react-hot-loader';


import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { browserHistory } from './history';
import { store, persistor } from './redux/store';

import "./index.scss";

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
