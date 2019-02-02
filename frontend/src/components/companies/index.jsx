import React, { Component } from 'react';
import { compose } from 'recompose';
import { CompaniesContainer, BreadCrumbContainer } from '@containers';
import styles from './index.scss';

class Companies extends Component {
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Companies',
      path: '/companies',
      active: true,
    }, true);
  }
  render() {
    return (
      <div className={styles.Companies}>
        Companies
      </div>
    );
  }
}

export default compose(CompaniesContainer, BreadCrumbContainer)(Companies);