/**
 * @format
 */

import React from 'react'
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './app/containers';
import App from './app/App';
import {name as appName} from './app/app.json';

const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => ReduxApp);
