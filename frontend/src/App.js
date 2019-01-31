import './App.scss';

import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import LoginForm from "./components/@common/forms/LoginForm";
import AppSidebar from './components/AppSidebar'

class App extends Component {
  render() {
    return (
		<div className="App">
			<AppSidebar></AppSidebar>
			<Route exact path="/login" component={LoginForm}/>
		</div>
    );
  }
}

export default App;
