import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";

import styles from "../scss/Profile.module.scss";

const ProfileTop = ({ profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
} }) => (
    <div className={clsx(styles.profileTop, "bg-primary", "p-2")}>
        <img
            className="round-img my-1"
            src={avatar}
            alt="Avatar"
        />
        <h1 className="large">{name}</h1>
        <p className="lead">{status} {company && <span> at {company}</span>}</p>
        <p>{location && <span>{location}</span>}</p>
        <div className={clsx(styles.icons, "my-1")}>
            {website && (
                <a href={website} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-globe fa-2x"></i>
                </a>
            )}
            {social &&
                Object.entries(social).filter(([_, value]) => value)
                    .map(([key, value]) => (
                        <a key={key} href={value} target="_blank" rel="noopener noreferrer">
                            <i className={`fas fa-${key} fa-2x`}></i>
                        </a>
                    ))}
        </div>
    </div>
)

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileTop
