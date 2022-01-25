import axios from "axios";
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
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
export const addLike = (postId, isPostList = true) => async (dispatch) => {
    try {
        const res = await axios.patch(`/posts/${postId}/like`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data, isPostList }
        });
    } catch (err) {
        const errors = err.response.data;
        Array.isArray(errors) &&
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
export const removeLike = (postId, isPostList = true) => async (dispatch) => {
    try {
        const res = await axios.patch(`/posts/${postId}/unlike`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data, isPostList }
        });
    } catch (err) {
        const errors = err.response.data;
        Array.isArray(errors) &&
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
        Array.isArray(errors) &&
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
        Array.isArray(errors) &&
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

// Get a post
export const getPost = postId => async (dispatch) => {
    try {
        const res = await axios.get(`/posts/${postId}`);

        dispatch({
            type: GET_POST,
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

// Add Comment
export const addComment = (postId, formData) => async (dispatch) => {
    try {
        const res = await axios.post(`/posts/${postId}/comments`, formData);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert('Comment Added!', 'success'));
    } catch (err) {
        const errors = err.response.data;
        Array.isArray(errors) &&
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

// Delete Comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
    try {
        await axios.delete(`/posts/${postId}/comments/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });

        dispatch(setAlert('Comment Removed!', 'success'));
    } catch (err) {
        const errors = err.response.data;
        Array.isArray(errors) &&
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

// Report post
export const reportPost = (data) => async (dispatch) => {
    try {
        await axios.post('/posts/report', data);

        dispatch(setAlert('Post Reported!', 'success'));
    } catch (err) {
        const errors = err.response.data;
        Array.isArray(errors) &&
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