import React  from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Layout } from './layout';
import { AuthContainer } from "@containers";
import { LoginLayout } from '../components';
import { withRouter, Route, Switch } from 'react-router-dom';

import './App.scss';
const App = ({ session }) => (
  <div className="App">
    <ToastContainer/>
  {
        <Switch>
            <Route exact path='/login' component={LoginLayout} />
            <Route path='/' component={Layout} />
        </Switch>
    }
    </div>
);

export default withRouter(AuthContainer(App));
