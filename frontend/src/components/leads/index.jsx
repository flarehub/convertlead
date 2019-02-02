import React from 'react';
import styles from './index.scss';
import { compose, lifecycle } from 'recompose';
import { BreadCrumbContainer } from '@containers';

const Leads = () => (
  <div className={styles.Leads}>
    Leads
  </div>
);

export default compose(BreadCrumbContainer, lifecycle({
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    })
  }
}))(Leads);