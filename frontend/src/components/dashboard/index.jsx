import React, { Component } from 'react';
import { compose } from 'recompose';
import { BreadCrumbContainer } from '@containers';
import styles from './index.scss';

class Dashboard extends Component {
  componentWillMount() {
    this.props.resetBreadCrumbToDefault();
  }

	render() {
		return (
			<div className={styles.Dashboard}>
				DashBoard
			</div>
		);
	}
}
export default compose(BreadCrumbContainer)(Dashboard);