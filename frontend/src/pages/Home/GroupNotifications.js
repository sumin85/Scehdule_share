import React, {useState, useEffect} from "react";
import axios from "axios";

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
        <div className="section">
            <h3>그룹 일정 알림</h3>
            <div className="card">
                <ul>
                    {notifications.map((item, idx) => (
                        <li key={idx}>
                            [{item.group}] {item.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupNotifications;