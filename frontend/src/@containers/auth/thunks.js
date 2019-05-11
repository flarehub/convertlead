import * as R from 'ramda';
import {api, SessionStorage} from '../../@services';
import {addSessionToken, removeSessionToken} from './actions';
import {sendMessage} from '../messages/thunks';
import {loadProfileForm, updateUserProfile} from "../profile/actions";

export const login = (email, password) => async (dispatch, getState) => {
    try {
        const {data} = await api.post('/login', {
            email,
            password,
        });

        const tokenData = {
            token: data.access_token,
            refreshToken: data.refresh_token,
            user: data.user,
        };

        // add token to local session storage
        SessionStorage.setItem('session', tokenData);
        await dispatch(addSessionToken(tokenData));
        await dispatch(updateUserProfile(tokenData.user));
        await dispatch(loadProfileForm(tokenData.user));
        await dispatch(sendMessage('You have been logged successfully!'));
        window.webViewBridge.send('onLogin', tokenData, function(res) {
            console.log("===Success Send Login Data to app!!! ===: ", res)
        }, function(err) {
            console.error("===Error Send Login Data to app!!! ===: ", err)
        });
    } catch (error) {
        await dispatch(sendMessage(error.message, true));
    }
};

export const autoLogin = () => {
    const session = SessionStorage.getItem('session');
    const checkSessionTokenExits = R.pathOr(false, ['token'], session);
    const user = R.pathOr({}, ['user'], session);

    return async (dispatch) => {
        if (checkSessionTokenExits) {
            await dispatch(addSessionToken(session));
            await dispatch(updateUserProfile(user));
            await dispatch(loadProfileForm(user));
        }
    };
};

export const logout = () => {
    SessionStorage.removeItem('session');
    window.webViewBridge.send('onLogout', '', function(res) {
        console.log("===Success Logout to app!!! ===: ", res)
    }, function(err) {
        console.error("===Error Logout to app!!! ===: ", err)
    });
    return (dispatch) => {
        dispatch(removeSessionToken());
    };
};
