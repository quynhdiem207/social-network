import { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from "clsx";

import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Modal from "../layouts/Modal";

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { loading, profile }
}) => {

    useEffect(() => {
        getCurrentProfile();
    }, []);

    const [chooseDelete, setChooseDelete] = useState(false);

    const onDeleteAccount = () => {
        setChooseDelete(true);
    }

    const onCancel = useCallback(() => {
        setChooseDelete(false);
    }, [])

    const onDelete = useCallback(() => {
        deleteAccount();
    }, [])

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

            {chooseDelete && (
                <Modal
                    title='Delete Account'
                    massage='Are you sure? This can NOT be undone!'
                    onCancel={onCancel}
                    onOK={onDelete}
                />
            )}

            <div class="my-2">
                <button
                    class="btn btn-danger"
                    onClick={onDeleteAccount}
                >
                    <i class="fas fa-user-minus"></i> {' '}
                    Delete My Account
                </button>
            </div>
        </Fragment>
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
