import axios from 'axios';
import connection from './connection';

const api = axios.create({
 baseURL: connection
  // baseURL: 'http://25.105.184.74:3333'

});

export default api;