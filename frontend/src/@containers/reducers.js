import { combineReducers } from 'redux'
import deals from './deals/reducer';
import profile from './profile/reducer';
import menu from './menu/reducer';
import breadcrumb from './breadcrumb/reducer';
import auth from './auth/reducer';
import companies from './companies/reducer';
import agents from './agents/reducer';
import loader from './loader/reducer';
import leads from './leads/reducer';

const reducers = combineReducers({
  loader,
  leads,
  agents,
  companies,
  deals,
  auth,
	menu,
	profile,
  breadcrumb,
});

export default reducers;