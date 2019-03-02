import { combineReducers } from 'redux';

import agent from './agent/reducer';
import campaign from './campaign/reducer';
import company from './company/reducer';
import deal from './deal/reducer';
import lead from './lead/reducer';
import optinFormIntegration from './integrations/optinform/reducer';

export default combineReducers({
  optinFormIntegration,
  agent,
  campaign,
  company,
  deal,
  lead,
});
