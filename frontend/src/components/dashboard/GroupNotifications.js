import React, { useState, useEffect } from 'react';

const GroupNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // This will be replaced with actual API call
        // axios.get(`${process.env.REACT_APP_API_URL}/api/group-notifications`)
        //     .then(response => setNotifications(response.data))
        //     .catch(error => console.error("Error fetching notifications:", error));
        
        // Mock data for now
        setNotifications([
            { id: 1, group: '가족', message: '주말 모임 일정이 등록되었습니다' },
            { id: 2, group: '친구들', message: '새로운 사진이 업로드 되었습니다' },
        ]);
    }, []);

    return (
        <div className="card">
            <h3>그룹 알림</h3>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        [{notification.group}] {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupNotifications;
