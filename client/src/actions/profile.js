import axios from "axios";
import { decodeHTML5 } from "entities";

import { setAlert } from "./alert";
import {
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    NO_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED
} from './types';

// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get('/me/profile');

        const data = JSON.parse(decodeHTML5(JSON.stringify(res.data)));

        dispatch({
            type: GET_PROFILE,
            payload: data
        });
    } catch (err) {
        // clear profile that guest viewed when register
        dispatch({ type: CLEAR_PROFILE });

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Get all profiles
export const getProfiles = () => async (dispatch) => {
    dispatch({
        type: CLEAR_PROFILE
    })

    try {
        const res = await axios.get('/profiles');

        dispatch({
            type: GET_PROFILES,
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

// Get profile by ID
export const getProfileById = userId => async (dispatch) => {
    try {
        const res = await axios.get(`/profiles/user/${userId}`);

        const data = JSON.parse(decodeHTML5(JSON.stringify(res.data)));

        dispatch({
            type: GET_PROFILE,
            payload: data
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

// Get Github Repos
export const getGithubRepos = username => async (dispatch) => {
    try {
        const res = await axios.get(`/profiles/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: NO_REPOS
        });
    }
}

// Create or Update Profile
export const createProfile = (formData, navigate, edit = false) =>
    async (dispatch) => {
        try {
            const res = await axios.post('/me/profile', formData);

            const data = JSON.parse(decodeHTML5(JSON.stringify(res.data)));

            dispatch({
                type: GET_PROFILE,
                payload: data
            });

            dispatch(setAlert(
                edit ? 'Profile updated' : 'Profile created',
                'success'
            ));

            if (!edit) {
                navigate('/dashboard');
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
export const addExperience = (formData, navigate) => async (dispatch) => {
    try {
        const res = await axios.patch('/me/profile/experience', formData);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added!', 'success'));

        navigate('/dashboard');
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
export const addEducation = (formData, navigate) => async (dispatch) => {
    try {
        const res = await axios.patch('/me/profile/education', formData);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education added', 'success'));

        navigate('/dashboard');
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

// Delete Experience
export const deleteExperience = id => async (dispatch) => {
    try {
        const res = await axios.delete(`/me/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Removed', 'success'));
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

// Delete Education
export const deleteEducation = id => async (dispatch) => {
    try {
        const res = await axios.delete(`/me/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Removed', 'success'));
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

// Delete Account & Profile
export const deleteAccount = () => async (dispatch) => {
    try {
        await axios.delete('/me/profile');

        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });
        localStorage.removeItem('token');

        dispatch(setAlert('Your account has been deleted!'));
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