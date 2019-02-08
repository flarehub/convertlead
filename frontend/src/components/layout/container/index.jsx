import React from 'react';
import { Route } from 'react-router-dom';
import Routes from 'components/routers';
import styles from './index.scss';

export default () => (<div className={styles.Container}>
  <Routes />
</div>)