import React from 'react';
import { withRouter } from 'react-router-dom';
import Routes from 'components/routers';

import styles from './index.scss';

const Container = (props) => (<div className={styles.Container}>
  <Routes />
</div>);

export default withRouter(Container)