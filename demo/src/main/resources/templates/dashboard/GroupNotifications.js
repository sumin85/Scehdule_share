import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/group-notifications`)
        .then(res => {
            setNotifications(res.data);
        })
        .catch(error=> {
            console.error("알림 가져오기 실패:", error);
        });
    },[]);

    return(
        <div className="card">
            <h3>그룹 일정 알림</h3>
            <ul>
                {notifications.map((item, idx) => (
                    <li key={idx}>
                        [{item.group}] {item.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupNotifications;