import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addPost } from "../../actions/post";
import styles from "../scss/Post.module.scss";

const PostForm = ({ addPost }) => {
    const [text, setText] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        addPost({ text });
        setText('');
    }

    return (
        <div className={styles.postForm}>
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form onSubmit={onSubmit} className="form my-1">
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
}

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
}

export default connect(null, { addPost })(PostForm);
