import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "../scss/Profiles.module.scss";

const ProfileItem = ({ profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
} }) => (
    <div className={clsx(styles.profile, "bg-light")}>
        <img
            className="round-img"
            src={avatar}
            alt="Avatar"
        />
        <div>
            <h2>{name}</h2>
            <p>{status} {company && <span> at {company}</span>}</p>
            <p className='my-1'>{location && <span>{location}</span>}</p>
            <Link to={`/profile/${_id}`} className="btn btn-primary">View Profile</Link>
        </div>

        <ul>
            {skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="text-primary">
                    <i className="fas fa-check"></i> {skill}
                </li>
            ))}
        </ul>
    </div>
)

export default ProfileItem
