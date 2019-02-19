import React, { Component } from 'react';
import { compose } from 'recompose';
import { Segment, Header } from 'semantic-ui-react';
import {BreadCrumbContainer, ProfileContainer} from "../../@containers";
import ProfileForm from '../@common/forms/profile';

class Profile extends Component {
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Profile',
      path: '/profile',
      active: true,
    }, true);
  }
  render() {
    return (<Segment basic>
      <Segment basic attached='top' textAlign='left'>
        <Header as='h1'>Profile</Header>
      </Segment>
      <Segment attached='bottom'>
        <ProfileForm />
      </Segment>
    </Segment>)
  }
}

export default compose(ProfileContainer, BreadCrumbContainer)(Profile);