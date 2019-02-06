import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { compose, lifecycle } from 'recompose';
import styles from './index.scss';
import { Breadcrumb } from 'components';
import { ProfileContainer } from '@containers';

const Header = ({ profile }) => (
  <div className={styles.Header}>
    <Grid columns={2} stackable>
      <Grid.Row verticalAlign='middle'>
        <Grid.Column>
            <Breadcrumb />
        </Grid.Column>
        <Grid.Column>
          { profile.name }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default compose(ProfileContainer, lifecycle({
  componentWillMount() {
    this.props.getUserProfile();
  }
}))(Header);