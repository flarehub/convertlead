import React from 'react';
import { withRouter } from 'react-router-dom';
import Routes from 'components/routers';
import { LoaderContainer } from '@containers';

import {
  Dimmer,
  Loader
} from 'semantic-ui-react';
import styles from './index.scss';

const Container = (props) => (<div className={styles.Container}>
  <Dimmer active={!props.loadReady} inverted>
    <Loader size='medium'>Loading</Loader>
  </Dimmer>
  <Routes />
</div>);

export default withRouter(LoaderContainer(Container))