import axios from 'axios';

const setAuthToken = (token) => {

    // store our JWT in LS and set axios headers if we do have a token
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default setAuthToken;