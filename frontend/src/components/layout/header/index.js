import React from 'react';
import { Grid } from 'semantic-ui-react';
import styles from './index.scss';
import { Breadcrumb } from 'components';
import { ProfileContainer } from '@containers';

const Header = ({ profile }) => (
  <div className={styles.Header}>
    <Grid columns={2} stackable>
      <Grid.Row verticalAlign="middle">
        <Grid.Column>
          <Breadcrumb />
        </Grid.Column>
        <Grid.Column>
          <label>{ profile.name }</label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default ProfileContainer(Header);
