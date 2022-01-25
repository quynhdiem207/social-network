import React, { useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';

const ReportPost = ({ onReport, post, onCancel }) => {
    const [formData, setFormData] = useState({
        subject: '',
        detail: ''
    });

    const { subject, detail } = formData;

    const subjects = useRef([
        'Incorrect content',
        'Unrelated content',
        'Objectionable content'
    ]);

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        onReport({ ...post, ...formData });
        onCancel();
    };

    return (
        <form onSubmit={onSubmit} className="form">
            <div className='form-group'>
                {subjects.current.map(subj => (
                    <div key={subj}>
                        <input
                            type='radio'
                            name='subject'
                            value={subj}
                            id={subj}
                            onChange={onChange}
                            checked={subject === subj}
                        /> {' '}
                        <label htmlFor={subj}>{subj}</label>
                    </div>
                ))}
            </div>
            <textarea
                name="detail"
                cols={30}
                rows={4}
                placeholder="Detail content reported"
                value={detail}
                onChange={onChange}
            ></textarea>
            <input type="submit" className="btn btn-dark my-1" value="Report" />
        </form>
    );
};

ReportPost.propTypes = {
    onReport: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

export default memo(ReportPost);
