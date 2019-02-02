import { api, SessionStorage } from '../../@services';
import { addSessionToken } from "./actions";

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const tokenData = {
        token: response.access_token,
        refreshToken: response.refresh_token,
      };

      await dispatch(addSessionToken(tokenData));

      // add token to local session storage
      SessionStorage.setItem('session', tokenData);

    } catch (error) {
      // todo need to send a user message
    }
  }
};