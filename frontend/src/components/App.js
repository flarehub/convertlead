import React  from 'react';
import { Layout } from './layout';
import { compose } from 'recompose';
import { AuthContainer } from "@containers";
import { LoginLayout } from '../components';

import './App.scss';

const App = ({ session }) => (
  <div className="App">
    {session.isAuthorised ? <Layout/> : <LoginLayout />}
  </div>
);

export default compose(AuthContainer)(App);
