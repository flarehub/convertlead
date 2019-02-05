import { api, SessionStorage } from '../../@services';
import {addSessionToken, removeSessionToken} from "./actions";
import * as R from "ramda";

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

      // add token to local session storage
      SessionStorage.setItem('session', tokenData);

    } catch (error) {
      // todo need to send a user message
    }
  }
};

export const autoLogin = () => {
  const session = SessionStorage.getItem('session');
  const checkSessionTokenExits = R.pathOr(false, ['token'], session);

  return dispatch => {
    if (checkSessionTokenExits) {
      dispatch(addSessionToken(session));
    } else {
      // todo need to add message to login
    }
  };
};

export const logout = () => {
  SessionStorage.removeItem('session');
  return dispatch => {
    dispatch(removeSessionToken());
  };
};