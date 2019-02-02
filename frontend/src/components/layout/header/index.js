import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import styles from './index.scss';
import { Breadcrumb } from 'components';

export default () => (
  <div className={styles.Header}>
    <Grid columns={2} stackable>
      <Grid.Row verticalAlign='middle'>
        <Grid.Column>
            <Breadcrumb />
        </Grid.Column>
        <Grid.Column>
            User
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);
