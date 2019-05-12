import axios from 'axios';
import * as R from 'ramda';
import config from './config';

class Api {
    constructor(axios, config) {
        this.axios = axios;
        this.config = config;
    }

    createServer() {
        return this.axios.create({
            baseURL: this.config.get('REACT_APP_API_SERVER'),
        });
    }
}

const instance = new Api(axios, config).createServer();

instance.interceptors.response.use(response => response,
    (error) => {
        if (error.response && error.response.data) {
            const errors = R.pathOr([], ['response', 'data', 'errors'], error);
            const message = R.pathOr([], ['response', 'data', 'message'], error);
            const messages = R.reduce((acc, errors) => {
                return `${acc}\n ${errors.join(',')}`;
            }, '', R.values(errors));

            return Promise.reject(new Error(`${message} ${messages}`, error.status));
        }
        return Promise.reject(error);
    }
);

export default instance;