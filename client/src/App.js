import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import { loadUser } from './actions/auth';

import { GlobalStyles } from "./components/layouts";
import { Navbar } from "./components/layouts";
import { Landing } from "./components/layouts";
import { Alert } from "./components/layouts";

import { Login } from "./components/auth";
import { Register } from "./components/auth";

import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

import Dashboard from "./components/dashboard/Dashboard";
import { CreateProfile } from "./components/profile-forms";
import { EditProfile } from "./components/profile-forms";
import { AddExperience } from "./components/profile-forms";
import { AddEducation } from "./components/profile-forms";

import PrivateRoute from "./components/routing/PrivateRoute";

const App = () => {

    useLayoutEffect(() => {
        store.dispatch(loadUser());
    }, [])

    return (
        <Provider store={store}>
            <BrowserRouter>
                <GlobalStyles>
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <section className="container">
                        <Alert />
                        <Switch>
                            <Route
                                exact
                                path="/login"
                                component={Login}
                            />
                            <Route
                                exact
                                path="/register"
                                component={Register}
                            />
                            <Route
                                exact
                                path="/profiles"
                                component={Profiles}
                            />
                            <Route
                                exact
                                path="/profile/:user_id"
                                component={Profile}
                            />
                            <PrivateRoute
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <PrivateRoute
                                exact
                                path="/create-profile"
                                component={CreateProfile}
                            />
                            <PrivateRoute
                                exact
                                path="/edit-profile"
                                component={EditProfile}
                            />
                            <PrivateRoute
                                exact
                                path="/add-experience"
                                component={AddExperience}
                            />
                            <PrivateRoute
                                exact
                                path="/add-education"
                                component={AddEducation}
                            />
                        </Switch>
                    </section>
                </GlobalStyles>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
