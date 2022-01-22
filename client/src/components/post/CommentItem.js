import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { decodeHTML5 } from 'entities';

import { deleteComment } from "../../actions/post";
import formatDate from '../../utils/formatDate';
import styles from '../scss/Post.module.scss';

const CommentItem = ({
    postId,
    comment: { _id, user, text, name, avatar, date },
    auth,
    deleteComment
}) => (
    <div className={`${styles.post} bg-white p-1 my-1`}>
        <div>
            <Link to={`/profile/${user}`}>
                <img
                    className="round-img"
                    src={avatar}
                    alt="Avatar"
                />
                <h4>{name}</h4>
            </Link>
        </div>
        <div>
            <p className="my-1">{decodeHTML5(text)}</p>
            <p className={styles.postDate}>
                Posted on {formatDate(date)}
            </p>
            {!auth.loading && user === auth.user._id && (
                <button
                    onClick={() => deleteComment(postId, _id)}
                    className="btn btn-danger"
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    </div>
);

CommentItem.propTypes = {
    postId: PropTypes.string.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem);
