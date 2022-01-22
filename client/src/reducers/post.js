import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    UPDATE_COMMENT,
    DELETE_POST
} from "../actions/types";

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
};

const Post = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map(post => (
                    post._id === payload.postId ? {
                        ...post, likes: payload.likes
                    } : post)
                ),
                loading: false
            };
        case UPDATE_COMMENT:
            return {
                ...state,
                posts: state.posts.map(post => (post._id === payload.postId ? {
                    ...post, comments: payload.comments
                } : post)),
                loading: false
            };
        default:
            return state;
    }
};

export default Post;
