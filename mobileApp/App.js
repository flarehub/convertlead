/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import FCM from "react-native-fcm";

type Props = {};
export default class App extends Component<Props> {

    async componentDidMount() {
        FCM.createNotificationChannel({
            id: 'default',
            name: 'Default',
            description: 'used for example',
            priority: 'high'
        })
        FCM.getInitialNotification().then(notify => {
            console.log("======>notify", notify);
        });
        try {
            let result = await FCM.requestPermissions({
                badge: false,
                sound: true,
                alert: true
            });
        } catch (e) {
            console.error("FCM.requestPermissions error::::::", e);
        }

        FCM.getFCMToken().then(token => {
            console.log('getFCMToken:', token);
            if (token == null) {
                FCM.on('FCMTokenRefreshed', token => {
                    console.log('FCMTokenRefreshed:', token);
                });
            }
        });
    }

    render() {
        return (
            <WebView source={{uri: 'http://155.138.229.190/login'}} style={{marginTop: 0}}/>
        );
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
