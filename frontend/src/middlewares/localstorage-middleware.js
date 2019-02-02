import * as R from 'ramda';
import { SessionStorage } from "../@services";
import { addSessionToken, removeSessionToken } from "@containers/auth/actions";

const localStorageMiddleware = ({ getState, dispatch }) => next => action => {
  const stateToken = R.pathOr(false, ['session', 'token'], getState());
  const token = R.pathOr(false, ['token'], SessionStorage.getItem('session'));
  if (token && !stateToken) {
    dispatch(addSessionToken(token))
  }

  next(action);
};

export default localStorageMiddleware;