import React, { Component } from 'react';
import styles from './index.scss';
import { compose } from 'recompose';
import { BreadCrumbContainer, LeadsContainer } from '@containers';

class Leads extends Component {

  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    })
    this.props.loadLeads();
  }

  render() {
    return (
      <div className={styles.Leads}>
      </div>
    );
  }
}
export default compose(BreadCrumbContainer, LeadsContainer)(Leads);