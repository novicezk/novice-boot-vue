import axios from 'axios';
import vuex from '../store';

let rest = axios.create({
  baseURL: process.env.BACKEND_URL
});

rest.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      vuex.dispatch('seCurrenttUser', null);
      location.href = "/#/login";
    }
  }
);

export default rest
