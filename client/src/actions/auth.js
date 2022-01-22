import axios from "axios";

import {
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from './alert';

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        const res = await axios.get('/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

// Register user
export const register = (formData) => async (dispatch) => {
    try {
        const res = await axios.post('/users/register', formData);

        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);

        dispatch(setAlert('Sign up successfully!', 'success'));

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));
    }
}

// Login user
export const login = (email, password) => async dispatch => {
    const body = { email, password };

    try {
        const res = await axios.post('/auth', body);

        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);

        dispatch(setAlert('Login successfully!', 'success'));

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));
    }
}

// Logout / Clear profile
export const logout = (navigate) => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
    navigate('/')
}