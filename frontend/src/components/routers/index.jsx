import React from 'react';
import { Agents, Companies, Dashboard, Leads } from "../index";
import PrivateRoute from './PrivateRoute';
import styles from './index.scss';

export default () => (<div className={styles.Routes}>
  <PrivateRoute exact path='/dashboard' component={Dashboard} />
  <PrivateRoute exact path='/companies' component={Companies} />
  <PrivateRoute exact path='/leads' component={Leads} />
  <PrivateRoute exact path='/agents' component={Agents} />
</div>)