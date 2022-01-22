import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import clsx from 'clsx';
import { decodeHTML5 } from "entities";

import { addLike, removeLike, deletePost } from "../../actions/post";
import formatDate from "../../utils/formatDate";
import styles from "../scss/Post.module.scss";

const PostItem = ({
    addLike,
    removeLike,
    deletePost,
    auth,
    post: { _id, user, name, avatar, text, likes, comments, createdAt },
    showActions
}) => (
    <div className={clsx(styles.post, "bg-white", "p-1", "my-1")}>
        <div>
            <Link to={`/profile/${user}`}>
                <img className="round-img" src={avatar} alt="Avatar" />
                <h4>{name}</h4>
            </Link>
        </div>
        <div>
            <p className="my-1">{decodeHTML5(text)}</p>
            <p className={styles.postDate}>
                Posted on {formatDate(createdAt)}
            </p>
            {showActions && (
                <>
                    <button onClick={() => addLike(_id)} className="btn btn-light">
                        <i className="fas fa-thumbs-up"></i> {' '}
                        {likes.length > 0 && (<span>{likes.length}</span>)}
                    </button>
                    <button onClick={() => removeLike(_id)} className="btn btn-light">
                        <i className="fas fa-thumbs-down"></i>
                    </button>
                    <Link to={`/post/${_id}`} className="btn btn-primary">
                        Discussion {' '}
                        {comments.length > 0 && (
                            <span className={styles.commentCount}> {comments.length}</span>
                        )}
                    </Link>
                    {!auth.loading && user === auth.user._id && (
                        <button onClick={() => deletePost(_id)} className="btn btn-danger">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </>
            )}
        </div>
    </div>
);

PostItem.defaultProps = {
    showActions: true
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { addLike, removeLike, deletePost }
)(PostItem);
