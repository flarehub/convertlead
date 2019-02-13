import { api, SessionStorage } from '../../@services';
import {addSessionToken, removeSessionToken} from "./actions";
import * as R from "ramda";
import { sendMessage } from "../messages/thunks";

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/login', {
        email,
        password,
      });

      const tokenData = {
        token: data.access_token,
        refreshToken: data.refresh_token,
      };

      await dispatch(addSessionToken(tokenData));
      dispatch(sendMessage('You have been logged successfully!'));

      // add token to local session storage
      SessionStorage.setItem('session', tokenData);

    } catch (error) {
      dispatch(sendMessage(error.message, true))
    }
  }
};

export const autoLogin = () => {
  const session = SessionStorage.getItem('session');
  const checkSessionTokenExits = R.pathOr(false, ['token'], session);

  return dispatch => {
    if (checkSessionTokenExits) {
      dispatch(addSessionToken(session));
    }
  };
};

export const logout = () => {
  SessionStorage.removeItem('session');
  return dispatch => {
    dispatch(removeSessionToken());
  };
};