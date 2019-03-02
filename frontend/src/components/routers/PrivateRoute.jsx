import React from 'react'
import { AuthContainer } from '@containers'
import {
	Route,
	Redirect,
  withRouter,
} from 'react-router-dom'
import {Auth} from "@services";

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
    Auth.isAuthorised() ? <Component {...props} /> : <Redirect to='/login' />
	)} />
);

export default withRouter(AuthContainer(PrivateRoute));
