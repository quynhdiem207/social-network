import axios from "axios";
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    UPDATE_COMMENT,
    DELETE_POST,
    ADD_POST
} from "./types";
import { setAlert } from "./alert";

// Get all posts
export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};

// Add like
export const addLike = postId => async (dispatch) => {
    try {
        const res = await axios.patch(`/posts/${postId}/like`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'light')));

        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};

// Remove like
export const removeLike = postId => async (dispatch) => {
    try {
        const res = await axios.patch(`/posts/${postId}/unlike`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'light')));

        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};

// Delete a post
export const deletePost = postId => async (dispatch) => {
    try {
        await axios.delete(`/posts/${postId}`);

        dispatch({
            type: DELETE_POST,
            payload: postId
        });

        dispatch(setAlert('Post Removed!', 'success'));
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));

        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};

// Add a post
export const addPost = formData => async (dispatch) => {
    try {
        const res = await axios.post(`/posts`, formData);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert('Post Created!', 'success'));
    } catch (err) {
        const errors = err.response.data;
        errors.forEach(error => dispatch(setAlert(error, 'danger')));

        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};
