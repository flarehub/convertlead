import React from 'react';
import {
  Agents,
  Companies,
  Dashboard,
  Leads,
  Profile,
  Campaigns,
  LeadNotes,
  CompanyProfile, AgentProfile,
} from "../index";
import PrivateRoute from './PrivateRoute';
import './index.scss';

export default () => (<div className='freshappRoutes'>
  {/* AGENCY or COMPANY or Agent */}
  <PrivateRoute exact path='/' component={Dashboard} />
  <PrivateRoute exact path='/dashboard' component={Dashboard} />

  {/* only AGENCY ROUTS */}
  <PrivateRoute exact path='/companies' component={Companies} />
  <PrivateRoute exact path='/companies/:companyId/profile' component={CompanyProfile} />
  <PrivateRoute exact path='/companies/:companyId/deals/:dealId/campaigns' component={Campaigns} />
  <PrivateRoute exact path='/companies/:companyId/leads/:leadId/notes' component={LeadNotes} />
  <PrivateRoute exact path='/companies/:companyId/agents' component={Agents} />
  <PrivateRoute exact path='/companies/:companyId/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/campaigns/:campaignId/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/deals' component={Dashboard} />

  {/* only AGENCY AND COMPANY ROUTS */}
  <PrivateRoute exact path='/agents' component={Agents} />
  <PrivateRoute exact path='/agents/:agentId/profile' component={AgentProfile} />
  <PrivateRoute exact path='/agents/:agentId/campaigns' component={Campaigns} />
  <PrivateRoute exact path='/profile' component={Profile} />
  <PrivateRoute exact path='/leads' component={Leads} />

  {/* only COMPANY ROUTS */}
  <PrivateRoute exact path='/deals/:dealId/campaigns' component={Campaigns} />
  <PrivateRoute exact path='/leads/:leadId/notes' component={LeadNotes} />
  <PrivateRoute exact path='/campaigns/:campaignId/leads' component={Leads} />
  <PrivateRoute exact path='/stats' component={CompanyProfile} />
  <PrivateRoute exact path='/agents/:agentId/leads' component={Leads} />

</div>)