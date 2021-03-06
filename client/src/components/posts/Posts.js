import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPosts } from "../../actions/post";
import PostForm from './PostForm';
import PostItem from './PostItem';
import { Spinner } from "../layouts";

const Posts = ({ post: { posts, loading }, getPosts, auth }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        loading ? <Spinner /> : (
            <section className='container'>
                <h1 className="large text-primary">
                    Posts
                </h1>
                <p className="lead">
                    <i className="fas fa-user"></i> Welcome to the community!
                </p>

                {/* <PostForm /> */}
                {auth.isAuthenticed && <PostForm />}

                <div className="posts">
                    {posts.map(post => (
                        <PostItem key={post._id} post={post} isPostList />
                    ))}
                </div>
            </section>
        )
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(mapStateToProps, { getPosts })(Posts);
