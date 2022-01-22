import axios from 'axios';
import store from '../store';
import { logout } from '../actions/auth';

const setDefaultsConfig = () => {
    // Global axios defaults baseURL
    axios.defaults.baseURL = '/api';

    /*
     NOTE: intercept any error responses from the api,
     and check if the token is no longer valid.
     ie. Token has expired, or user is no longer authenticated.
     logout the user if the token has expired
    */

    axios.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response.status === 401) {
                store.dispatch(logout());
            }
            return Promise.reject(err);
        }
    );
}

export default setDefaultsConfig;