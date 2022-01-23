import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import setReqApiConfig from "./utils/setReqApiConfig";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from './actions/auth';

import { GlobalStyles } from "./components/layouts";
import { Navbar } from "./components/layouts";
import { Landing } from "./components/layouts";
import { Alert } from "./components/layouts";

import { Login } from "./components/auth";
import { Register } from "./components/auth";

import Dashboard from "./components/dashboard/Dashboard";
import { ProfileForm } from "./components/profile-forms";
import { AddExperience } from "./components/profile-forms";
import { AddEducation } from "./components/profile-forms";

import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

import { NotFound } from "./components/layouts";

import PrivateRoute from "./components/routing/PrivateRoute";

import { LOGOUT } from "./actions/types";

const App = () => {

    useLayoutEffect(() => {
        // set defaults config for all requests
        setReqApiConfig();

        // check for token in Local Storage when app first runs
        const token = localStorage.getItem('token');
        if (token) {
            // if there is a token set axios headers for all requests
            setAuthToken(token);
        }

        // try to fetch a user, if no token or invalid token we will get a 401 response from our API
        store.dispatch(loadUser());

        // log user out from all tabs if they log out in one tab
        window.addEventListener('storage', () => {
            if (!localStorage.token) store.dispatch({ type: LOGOUT });
        });
    }, [])

    return (
        <Provider store={store}>
            <BrowserRouter>
                <GlobalStyles>
                    <Navbar />
                    <Alert />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="login"
                            element={<Login />}
                        />
                        <Route
                            path="register"
                            element={<Register />}
                        />
                        <Route
                            path="profiles"
                            element={<Profiles />}
                        />
                        <Route
                            path="profile/:id"
                            element={<Profile />}
                        />
                        <Route
                            path="dashboard"
                            element={<PrivateRoute component={Dashboard} />}
                        />
                        <Route
                            path="create-profile"
                            element={<PrivateRoute component={ProfileForm} />}
                        />
                        <Route
                            path="edit-profile"
                            element={<PrivateRoute component={ProfileForm} />}
                        />
                        <Route
                            path="add-experience"
                            element={<PrivateRoute component={AddExperience} />}
                        />
                        <Route
                            path="add-education"
                            element={<PrivateRoute component={AddEducation} />}
                        />
                        <Route
                            path="posts"
                            element={<Posts />}
                        />
                        <Route
                            path="post/:id"
                            element={<Post />}
                        />
                        <Route
                            path="/*"
                            element={<NotFound />}
                        />
                    </Routes>
                </GlobalStyles>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
