import { combineReducers } from 'redux'
import deals from './deals/reducer';
import profile from './profile/reducer';
import menu from './menu/reducer';
import breadcrumb from './breadcrumb/reducer';
import auth from './auth/reducer';
import companies from './companies/reducer';
import agents from './agents/reducer';

const reducers = combineReducers({
  agents,
  companies,
  deals,
  auth,
	menu,
	profile,
  breadcrumb,
});

export default reducers;