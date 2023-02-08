import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Member = () => {
    console.log(useParams());
    // 頁面未完成後續要完成
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/Draw/playground");
    }, [])
    //
    return (
        <div className="member-wrap">
            <div className="nav-bar">Member Nav</div>
            <div className="member-content">Member content</div>
        </div>
    );
};

export default Member;
