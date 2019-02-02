import React from 'react'
import { compose, lifecycle } from 'recompose'
import { AuthContainer } from '@containers'
import {
	Route,
	Redirect,
} from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
    !!rest.session.token ? <Component {...props} /> : <Redirect to='/login' />
	)} />
);

export default compose(AuthContainer, lifecycle({
  componentWillMount() {
    console.log(this.props);
  }
}))(PrivateRoute);
