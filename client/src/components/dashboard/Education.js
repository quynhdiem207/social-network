import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Education = ({ education }) => {
    const educations = education.map((edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">
                <Moment format='YYYY-MM-DD'>{edu.from}</Moment> - {
                    edu.to === null ? (
                        ' Now'
                    ) : (
                        <Moment format='YYYY-MM-DD'>{edu.to}</Moment>
                    )
                }
            </td>
            <td>
                <button className="btn btn-danger">
                    Delete
                </button>
            </td>
        </tr>
    )))
    return (
        <>
            <h2 class="my-2">Education Credentials</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th class="hide-sm">Degree</th>
                        <th class="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
}

export default Education;
