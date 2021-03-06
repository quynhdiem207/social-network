import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { getPost } from '../../actions/post';
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { Spinner } from '../layouts';
import styles from '../scss/Post.module.scss';

const Post = ({ getPost, post: { post, loading }, auth }) => {
    const { id } = useParams();

    useEffect(() => {
        getPost(id);
    }, [getPost, id]);

    return (
        loading || post === null ? <Spinner /> : (
            <section className='container'>
                <Link to="/posts" className="btn">Back To Posts</Link>
                <PostItem post={post} showActions={false} isPostList={false} />
                {auth.isAuthenticated && <CommentForm postId={id} />}
                <div className={styles.comments}>
                    {post.comments.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            postId={id}
                        />
                    ))}
                </div>
            </section>
        )
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(mapStateToProps, { getPost })(Post);
