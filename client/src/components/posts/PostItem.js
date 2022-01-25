import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import clsx from 'clsx';
import { decodeHTML5 } from "entities";

import { addLike, removeLike, deletePost, reportPost } from "../../actions/post";
import { Modal } from "../layouts";
import ReportPost from "./ReportPost";
import formatDate from "../../utils/formatDate";
import styles from "../scss/Post.module.scss";

const PostItem = ({
    addLike,
    removeLike,
    deletePost,
    reportPost,
    auth,
    post: { _id, user, name, avatar, text, likes, comments, createdAt },
    showActions,
    isPostList
}) => {
    const [isLiked, setIsLiked] = useState(() => {
        if (!auth.isAuthenticated) return false;
        const liked = likes.find(like => like.user === auth.user._id);
        return liked ? true : false;
    });

    const [report, setReport] = useState(false);

    const onCancel = useCallback(() => {
        setReport(false);
    }, [])

    const Report = useCallback(() => (
        <ReportPost
            onReport={reportPost}
            post={{ _id, author: user, name, avatar, text, createdAt }}
            onCancel={onCancel}
        />
    ), [reportPost, _id])

    return (
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
                <button
                    onClick={() => {
                        if (auth.isAuthenticated) {
                            isLiked ? removeLike(_id, isPostList) : addLike(_id, isPostList);
                            setIsLiked(!isLiked);
                        }
                    }}
                    className={clsx('btn btn-light', { ['disabled']: !auth.isAuthenticated })}
                >
                    <i className={`${isLiked ? 'fas' : 'far'} fa-thumbs-up`}></i> {' '}
                    {likes.length > 0 && (<span>{likes.length}</span>)}
                </button>
                {showActions && (
                    <>
                        <Link to={`/post/${_id}`} className="btn btn-primary">
                            Discussion {' '}
                            {comments.length > 0 && (
                                <span className={styles.commentCount}> {comments.length}</span>
                            )}
                        </Link>
                        {auth.isAuthenticated && user === auth.user._id && (
                            <button onClick={() => deletePost(_id)} className="btn btn-danger">
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </>
                )}
                {auth.isAuthenticated && user !== auth.user._id && (
                    <button onClick={() => setReport(true)} className="btn btn-light">
                        Report
                    </button>
                )}
                {report && <Modal
                    title="Report"
                    onCancel={onCancel}
                    component={Report}
                />}
            </div>
        </div>
    );
}

PostItem.defaultProps = {
    showActions: true
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    reportPost: PropTypes.func.isRequired,
    isPostList: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { addLike, removeLike, deletePost, reportPost }
)(PostItem);
