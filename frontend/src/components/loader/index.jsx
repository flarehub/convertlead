import React from 'react';
import { LoaderContainer } from '@containers';

import {
  Dimmer,
  Loader as SemanticLoader
} from 'semantic-ui-react';
import styles from './index.scss';

const Loader = (props) => (<div className={styles.Loader}>
  <Dimmer active={!props.loadReady} inverted>
    <SemanticLoader size='medium'>Loading</SemanticLoader>
  </Dimmer>
</div>);

export default LoaderContainer(Loader)