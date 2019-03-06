import React from 'react';
import { compose, lifecycle } from 'recompose';
import 'react-toastify/dist/ReactToastify.css';

import { withRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './layout';
import { AuthContainer, ProfileContainer } from '@containers';
import { LoginLayout, OptinFormPage } from '.';

import './App.scss';

const App = ({ session }) => (
  <div className="App">
    {
      <Switch>
        <Route exact path="/login" component={LoginLayout} />
        <Route exact path="/campaign/:uuid" component={OptinFormPage} />
        <Route path="/" component={Layout} />
      </Switch>
    }
  </div>
);

export default withRouter(compose(AuthContainer, ProfileContainer, lifecycle({
  componentWillMount() {
    this.props.autoLogin();
  }
}))(App));
