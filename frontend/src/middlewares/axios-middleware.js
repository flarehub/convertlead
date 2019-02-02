import axios from 'axios';
import * as R from 'ramda';

const axiosMiddleWare = ({ getState }) => next => action => {
  const token = R.pathOr(false, ['session', 'token'], getState());
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    axios.defaults.headers.common['Authorization'] = null;
  }
  next(action);
};

export default axiosMiddleWare;