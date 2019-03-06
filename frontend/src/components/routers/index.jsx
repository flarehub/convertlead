import React from 'react';
import {
  Agents,
  Companies,
  Dashboard,
  Leads,
  Profile,
  Campaigns,
  LeadNotes,
  CompanyProfile,
} from "../index";
import PrivateRoute from './PrivateRoute';
import styles from './index.scss';

export default () => (<div className={styles.Routes}>
  <PrivateRoute exact path='/' component={Dashboard} />
  <PrivateRoute exact path='/dashboard' component={Dashboard} />
  <PrivateRoute exact path='/companies' component={Companies} />
  <PrivateRoute exact path='/companies/:companyId/profile' component={CompanyProfile} />
  <PrivateRoute exact path='/companies/:companyId/deals/:dealId/campaigns' component={Campaigns} />
  <PrivateRoute exact path='/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/leads/:leadId/notes' component={LeadNotes} />
  <PrivateRoute exact path='/companies/:companyId/agents' component={Agents} />
  <PrivateRoute exact path='/companies/:companyId/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/campaigns/:campaignId/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/deals' component={Dashboard} />
  <PrivateRoute exact path='/agents' component={Agents} />
  <PrivateRoute exact path='/profile' component={Profile} />
</div>)