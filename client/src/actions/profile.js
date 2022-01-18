import axios from 'axios';
import { setAlert } from "./alert";
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './types';

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/me/profile');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Create or Update Profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }

    try {
        const res = await axios.post('api/me/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

        if (!edit) {
            history.push('./dashboard');
        }
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }

    try {
        const res = await axios.patch('api/me/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience added', 'success'));

        history.push('./dashboard');
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }

    try {
        const res = await axios.patch('api/me/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education added', 'success'));

        history.push('./dashboard');
    } catch (err) {
        const errors = err.response.data;
        console.log(errors);
        errors.forEach(error => dispatch(setAlert(error, 'danger')));

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}