import { Link, useNavigate } from 'react-router-dom';
import clsx from "clsx";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/auth'
import styles from '../scss/Navbar.module.scss';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
    const navigate = useNavigate();

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    const authLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li>
                <Link to="/dashboard">
                    <i className={clsx('fas', 'fa-user')} /> {' '}
                    <span className='hide-sm'>Dashboard</span>
                </Link>
            </li>
            <li>
                <a href='#!' onClick={() => logout(navigate)}>
                    <i className={clsx('fas', 'fa-sign-out-alt')} /> {' '}
                    <span className='hide-sm'>Logout</span>
                </a>
            </li>
        </ul>
    );

    return (
        <nav className={clsx(styles.navbar, 'bg-dark')}>
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {isAuthenticated ? authLinks : guestLinks}
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
