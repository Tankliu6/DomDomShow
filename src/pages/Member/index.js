import React from 'react';
import { useParams } from 'react-router-dom';
const Member = () => {
    console.log(useParams());
    return (
        <div className="member-wrap">
            <div className="nav-bar">Member Nav</div>
            <div className="member-content">Member content</div>
        </div>
    );
};

export default Member;
