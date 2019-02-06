import { combineReducers } from 'redux'
import deals from './deals/reducer';
import profile from './profile/reducer';
import menu from './menu/reducer';
import breadcrumb from './breadcrumb/reducer';
import auth from './auth/reducer';

const reducers = combineReducers({
  deals,
  auth,
	menu,
	profile,
  breadcrumb,
});

export default reducers;