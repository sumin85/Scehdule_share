import React, {useState, useEffect} from "react"

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = [
                { id: 1, message: "새로운 친구 요청이 왔습니다."},
                { id: 2, message: "일정이 곧 시작됩니다."}
            ];
            setNotifications(data);
        };
        fetchNotifications();
    },[]);

    return(
        <div className="notifications-page">
            <h2>알림</h2>

            {notifications.length > 0? (
                <ul className="notifications-list">
                    {notifications.map((n) => (
                        <li key={n.id}>{n.message}</li>
                    ))}
                </ul>
            ): (
                <p className="no-notifications">알림이 없습니다.</p>
            )}
        </div>
    );
};

export default Notifications;