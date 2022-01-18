import { useEffect, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from "clsx";

import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({
    getCurrentProfile,
    auth: { user },
    profile: { loading, profile }
}) => {

    useEffect(() => {
        getCurrentProfile();
    }, []);

    return (
        loading && profile === null ? <Spinner /> : <Fragment>
            <h1 className={clsx('large', 'text-primary')}>Dashboard</h1>
            <p className='lead'>
                <i className={clsx('fas', 'fa-user')} /> Welcome {user && user.name}
            </p>
            {profile !== null ? (
                <>
                    <DashboardActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                </>
            ) : (
                <>
                    <p>You have not yet setup a profile, please add some info</p>
                    <Link
                        to="/create-profile"
                        className={clsx('btn', 'btn-primary', 'my-1')}
                    >
                        Create Profile
                    </Link>
                </>
            )}
        </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
