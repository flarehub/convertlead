import React from 'react';
import { Route } from 'react-router-dom';
import {
  Agents,
  Companies,
  Dashboard,
  Leads,
  Profile,
  Campaigns,
  LeadNotes,
} from "../index";
import PrivateRoute from './PrivateRoute';
import styles from './index.scss';

export default () => (<div className={styles.Routes}>
  <PrivateRoute exact path='/dashboard' component={Dashboard} />
  <PrivateRoute exact path='/companies' component={Companies} />
  <PrivateRoute exact path='/companies/:companyId/deals/:dealId/campaigns' component={Campaigns} />
  <PrivateRoute exact path='/leads' component={Leads} />
  <PrivateRoute exact path='/companies/:companyId/leads/:leadId/notes' component={LeadNotes} />
  <PrivateRoute exact path='/agents' component={Agents} />
  <PrivateRoute exact path='/profile' component={Profile} />
</div>)