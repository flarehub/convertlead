import axios from 'axios';
import config from './config'

class Api {
  constructor(axios, config) {
    this.axios = axios;
    this.config = config;
  }
  createServer() {
    return this.axios.create({
      baseURL: this.config.get('REACT_APP_API_SERVER')
    })
  }
}

export default new Api(axios, config).createServer();