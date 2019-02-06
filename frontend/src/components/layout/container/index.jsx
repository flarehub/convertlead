import React from 'react';
import { Route } from 'react-router-dom';
import styles from './index.scss';
import Routes from 'components/routers';

export default () => (<div className={styles.Container}>
  <Routes />
</div>)