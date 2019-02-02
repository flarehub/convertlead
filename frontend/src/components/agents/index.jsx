import React from 'react';
import { compose, lifecycle } from 'recompose';
import { BreadCrumbContainer } from '@containers';

import styles from './index.scss';

const Agents = () => (
  <div className={styles.Agents}>
    Agents
  </div>
);

export default compose(BreadCrumbContainer, lifecycle({
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Agents',
      path: '/agents'
    })
  }
}))(Agents);