import React, {Component} from 'react';
import {Platform, BackHandler, Alert} from 'react-native';
import {compose} from 'recompose';
import {WebView} from 'react-native-webview';
import {AuthContainer} from "./containers";
import firebase from 'react-native-firebase';
import appConfig from './app.json';

type Props = {};
class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            senderId: appConfig.senderID
        };
        this.onWebViewMessage = this.onWebViewMessage.bind(this);
    }

    async componentWillMount() {
        this.props.init();
    }

    componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
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

    async createNotificationListeners() {
        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);

        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            if (Platform.OS === 'android' ) {
                notification
                    .android.setChannelId('test-channel')
                    .android.setSmallIcon('ic_launcher')
                    .setTitle(title)
                    .setBody(body)
                    .setSound("default");
                firebase.notifications().displayNotification(notification);
            } else {
                const notify = new firebase.notifications.Notification()
                    .setNotificationId('notificationId')
                    .setTitle(title)
                    .setBody(body)
                    .setSound("default");
                firebase.notifications().displayNotification(notify)
            }

            this.goToNewLeadPage();
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log("=============background000==============");
            const { title, body } = notificationOpen.notification;
            this.goToNewLeadPage();
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log("=============background111==============");
            const { title, body } = notificationOpen.notification;
            this.goToNewLeadPage();
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            this.props.addDeviceToken(fcmToken);
            console.log("===token===", fcmToken);
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
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
        const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
        return (
            <WebView
                source={{uri: 'http://app.convertlead.com'}}
                ref={webview => {
                    this.myWebView = webview;
                }}
                scrollEnabled={false}
                injectedJavaScript={INJECTEDJAVASCRIPT}
                onMessage={this.onWebViewMessage}
                style={{marginTop: 0}}/>
        );
    }

    goToNewLeadPage() {
        let msgData = {
            'title': 'NEW_LEAD_NOTIFICATION'
        }
        this.myWebView.injectJavaScript(`window.postMessage('${JSON.stringify(msgData)}', '*');`);
    }
}

export default compose(AuthContainer)(App);
