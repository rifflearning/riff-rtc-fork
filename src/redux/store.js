import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk'
import browserHistory from "../history"

const persistConfig = {
  key: 'root',
  storage,
}

const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});

let reducer = persistReducer(persistConfig, rootReducer)
// Apply the middleware to the store
let store = createStore(
  persistReducer(persistConfig, connectRouter(browserHistory)(rootReducer)), // new root reducer with router state, /* preloadedState, */
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(browserHistory))
));

let persistor = persistStore(store)

export {store, persistor};
