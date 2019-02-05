import React  from 'react';
import { Layout } from './layout';
import { compose } from 'recompose';
import { AuthContainer } from "@containers";
import { LoginLayout } from '../components';
import { Redirect, withRouter } from 'react-router-dom';

import './App.scss';

const App = ({ session }) => (
  <div className="App">
    {
      session.isAuthorised ? <Redirect to='/dashboard'/> : <Redirect to='/login' />
    }
    {
      session.isAuthorised ? <Layout /> : <LoginLayout />
    }
    </div>
);

export default withRouter(AuthContainer(App));
