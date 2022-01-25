import { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from "clsx";

import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { Modal } from "../layouts";
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import styles from "../scss/Dashboard.module.scss";

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile }
}) => {

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    const [chooseDelete, setChooseDelete] = useState(false);

    const onCancel = useCallback(() => {
        setChooseDelete(false);
    }, [])

    const Delete = useCallback(() => (
        <>
            <div>Are you sure? This can NOT be undone!</div>
            <button
                className="btn btn-danger mt-2"
                onClick={() => deleteAccount()}
            >
                Delete
            </button>
        </>
    ), [deleteAccount]);

    return (
        <section className="container">
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

            {chooseDelete && (
                <Modal
                    title='Delete Account'
                    onCancel={onCancel}
                    component={Delete}
                />
            )}

            <div className={clsx(styles.dashButtons, "my-2")}>
                <button
                    className="btn btn-light"
                    onClick={() => setChooseDelete(true)}
                >
                    <i className="fas fa-user-minus"></i> {' '}
                    Delete My Account
                </button>
            </div>
        </section>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getCurrentProfile, deleteAccount }
)(Dashboard);
