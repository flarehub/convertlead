import { createStore, applyMiddleware } from 'redux'
import { compose } from 'recompose';
import thunk from 'redux-thunk';
import reducers from './reducers'
import { localStorageMiddleware, axiosMiddelware } from '../middlewares';

const store = createStore(
	reducers,
  compose(applyMiddleware(thunk, localStorageMiddleware, axiosMiddelware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
);

export default store;