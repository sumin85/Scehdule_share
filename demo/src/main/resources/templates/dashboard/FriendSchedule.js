import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendsSchedule = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/friends-schedules`)
        .then(Response => {
            setSchedules(Response.data);
        })
        .catch(error => {
            console.error("일정 가져오기 실패:", error);
        });
    }, []);

    return (
        <div className="card">
            <h3>친구 일정 요약</h3>
            <ul>
                {schedules.map((item, idx) => (
                    <li key={idx}>
                        {item.name}: {item.time} {item.activity}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default FriendsSchedule;