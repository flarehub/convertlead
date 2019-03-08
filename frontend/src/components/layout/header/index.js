import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { compose, lifecycle } from 'recompose';
import styles from './index.scss';
import { Breadcrumb } from 'components';
import { ProfileContainer } from '@containers';

const LayoutHeader = ({ profile }) => (
  <div className={styles.Header}>
    <Grid columns={2} stackable>
      <Grid.Row verticalAlign="middle">
        <Grid.Column>
          <Breadcrumb />
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Header as='h2'>
            { profile.name }
          </Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default compose(ProfileContainer)(LayoutHeader);