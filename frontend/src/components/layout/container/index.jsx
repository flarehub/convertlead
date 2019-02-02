import React from 'react';
import { Route } from 'react-router-dom';
import styles from './index.scss';
import { Agents, Leads, Dashboard, Companies } from 'components';

export default () => (
  <div className={styles.Container}>
    <Route exact path='/dashboard' component={Dashboard} />
    <Route exact path='/companies' component={Companies} />
    <Route exact path='/leads' component={Leads} />
    <Route exact path='/agents' component={Agents} />
  </div>
)