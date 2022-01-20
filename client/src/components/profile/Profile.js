import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import clsx from "clsx";

import { getProfileById } from "../../actions/profile";
import { Spinner } from "../layouts";
import ProfileTop from "../profile/ProfileTop";
import ProfileAbout from "../profile/ProfileAbout";
import ProfileExperience from "../profile/ProfileExperience";
import ProfileEducation from "../profile/ProfileEducation";
import ProfileGithub from "../profile/ProfileGithub";
import styles from "../scss/Profile.module.scss";

const Profile = ({
    getProfileById,
    profile: { profile, loading },
    auth,
    match
}) => {
    useLayoutEffect(() => {
        getProfileById(match.params.user_id);
    }, [getProfileById, match.params.user_id]);

    return (
        profile === null || loading ? <Spinner /> : <>
            <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>

            {
                auth.isAuthenticated &&
                !auth.loading &&
                auth.user._id === profile.user._id &&
                (<Link to="/dashboard" className="btn btn-dark">Go To Dashboard</Link>)
            }

            <div className={clsx(styles.profileGrid, "my-1")}>
                <ProfileTop profile={profile} />
                <ProfileAbout profile={profile} />

                <div className={clsx(styles.profileExp, "bg-white", "p-2")}>
                    <h2 className="text-primary">Experience</h2>
                    {profile.experience.length > 0 ? (<>
                        {profile.experience.map(experience => (
                            <ProfileExperience
                                key={experience._id}
                                experience={experience}
                            />
                        ))}
                    </>) : (<h4>No experience credentials</h4>)}
                </div>

                <div className={clsx(styles.profileEdu, "bg-white", "p-2")}>
                    <h2 className="text-primary">Education</h2>
                    {profile.education.length > 0 ? (<>
                        {profile.education.map(education => (
                            <ProfileEducation
                                key={education._id}
                                education={education}
                            />
                        ))}
                    </>) : (<h4>No education credentials</h4>)}
                </div>

                {profile.githubusername && (
                    <ProfileGithub username={profile.githubusername} />
                )}
            </div>
        </>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
