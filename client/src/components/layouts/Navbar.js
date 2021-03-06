import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from "clsx";

import { logout } from '../../actions/auth'
import styles from '../scss/Navbar.module.scss';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
    const navigate = useNavigate();

    const [displaySubnav, toggleSubnav] = useState(false);

    const guestLinks = (
        <ul
            className={clsx(styles.subnav, {
                [styles.display]: displaySubnav,
                [styles.notDisplay]: !displaySubnav
            })}
            onClick={() => toggleSubnav(false)}
        >
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    const authLinks = (
        <ul
            className={clsx(styles.subnav, {
                [styles.display]: displaySubnav,
                [styles.notDisplay]: !displaySubnav
            })}
            onClick={() => toggleSubnav(false)}
        >
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li>
                <Link to="/dashboard">
                    <i className={clsx('fas', 'fa-user', 'hide-sm')} /> Dashboard
                </Link>
            </li>
            <li>
                <a href='#!' onClick={() => logout(navigate)}>
                    <i className={clsx('fas', 'fa-sign-out-alt', 'hide-sm')} /> Logout
                </a>
            </li>
        </ul>
    );

    return (
        <nav className={clsx(styles.navbar, 'bg-dark')}>
            <h1>
                <Link to="/">
                    <i className="fas fa-code"></i> {' '}
                    <span className={styles.hideXS}>DevConnector</span>
                </Link>
            </h1>
            <div>
                <div
                    className={styles.menuIcon}
                    onClick={() => toggleSubnav(!displaySubnav)}
                >
                    <i className="fa-solid fa-bars"></i>
                </div>
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);
