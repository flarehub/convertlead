import axios from 'axios';
import * as R from 'ramda';
import {SessionStorage} from "@services";

const axiosMiddleWare = ({ getState }) => next => (action) => {
  const token = R.pathOr(R.pathOr(false, ['token'], SessionStorage.getItem('session')), ['auth', 'session', 'token'], getState());
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = null;
  }
  next(action);
};

export default axiosMiddleWare;
