import React, {useState, useEffect} from "react";
import axios from "axios";

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
        <div className="section">
            <h3>친구 일정 요약</h3>
            <div className="card">
                <ul>
                    {schedules.map((item, idx) => (
                        <li key={idx}>
                            {item.name}: {item.time} {item.activity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default FriendsSchedule;