import React, {Component} from 'react';
import {BackHandler, ToastAndroid, Alert, Platform, StyleSheet} from 'react-native';
import {compose} from 'recompose';
import {WebView} from 'react-native-webview';
import NotifyService from "./NotifService";
import {AuthContainer} from "./containers";
import appConfig from './app.json';

type Props = {};
class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            senderId: appConfig.senderID
        };

        this.notify = new NotifyService(this.onRegister.bind(this), this.onNotify.bind(this));
        this.notify.configure(this.onRegister.bind(this), this.onNotify.bind(this), this.state.senderId);
        this.onWebViewMessage = this.onWebViewMessage.bind(this);
    }

    componentWillMount() {
        this.props.init();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => BackHandler.exitApp()},
            ],
            { cancelable: false });
        return true;
    }

    onLogin(msgData) {
        console.log("=====> Message Data from webview", msgData);
        this.props.login(msgData.data);
        this.props.registerDeviceToken();
    }

    onLogout(msgData) {
        console.log("=====> Message Data from webview", msgData);
        this.props.logout();
    }

    onWebViewMessage(event) {
        console.log("Message received from webview");

        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data);
        } catch (err) {
            console.warn(err);
            return;
        }

        switch (msgData.targetFunc) {
            case "onLogin":
                this[msgData.targetFunc].apply(this, [msgData]);
                break;
            case "onLogout":
                this[msgData.targetFunc].apply(this, [msgData]);
                break;
        }
    }

    render() {
        console.log(this.props.session);
        return (
            <WebView
                source={{uri: 'http://155.138.229.190/login'}}
                ref={webview => {
                    this.myWebView = webview;
                }}
                scrollEnabled={false}
                onMessage={this.onWebViewMessage}
                style={{marginTop: 0}}/>
        );
    }

    onRegister(token) {
        console.log(token);
        this.props.addDeviceToken(token.token);
    }

    onNotify(notify) {
        console.log("=========== Notification arrived =========", notify);
        let msgData = {
            'title': 'NEW_LEAD_NOTIFICATION'
        }
        this.myWebView.injectJavaScript(`window.postMessage('${JSON.stringify(msgData)}', '*');`);
    }
}

export default compose(AuthContainer)(App);
