import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import styles from "../scss/Profile.module.scss";

const ProfileAbout = ({ profile: {
    user: { name },
    bio,
    skills
} }) => (
    <div className={clsx(styles.profileAbout, "bg-light", "p-2")}>
        {bio && (
            <>
                <h2 className="text-primary">{name.trim().split(' ')[0]}'s Bio</h2>
                <p>{bio}</p>
                <div className="line"></div>
            </>
        )}

        <h2 className="text-primary">Skill Set</h2>
        <div className={styles.skills}>
            {skills.map((skill, index) => (
                <div key={index} className="p-1">
                    <i className="fa fa-check"></i> {skill}
                </div>
            ))}
        </div>
    </div>
)

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileAbout
