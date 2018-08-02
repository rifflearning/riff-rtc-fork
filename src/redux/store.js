import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import browserHistory from "../history"

const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});

// Apply the middleware to the store
export default createStore(
  connectRouter(browserHistory)(rootReducer), // new root reducer with router state, /* preloadedState, */
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(browserHistory))
  // other store enhancers if any
));
