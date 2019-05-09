/**
 * Sample React Native App__
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import NotifyService from "./NotifService";
import appConfig from './app.json';
import {Provider} from 'react-redux';
import {store} from 'containers';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            senderId: appConfig.senderID
        };

        this.notify = new NotifyService(this.onRegister.bind(this), this.onNotify.bind(this));
        this.notify.configure(this.onRegister.bind(this), this.onNotify.bind(this), this.state.senderId)
    }

    render() {
        return (
            <WebView source={{uri: 'http://155.138.229.190/login'}} style={{marginTop: 0}}/>
        );
    }

    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
    }

    onNotify(notify) {
        console.log("===========>", notify);
        Alert.alert(notify.title, notify.message);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
