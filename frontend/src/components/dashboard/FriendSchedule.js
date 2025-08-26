import React, { useState, useEffect } from 'react';

const FriendSchedule = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        // This will be replaced with actual API call
        // axios.get(`${process.env.REACT_APP_API_URL}/api/friends-schedules`)
        //     .then(response => setSchedules(response.data))
        //     .catch(error => console.error("Error fetching schedules:", error));
        
        // Mock data for now
        setSchedules([
            { id: 1, name: '친구1', time: '10:00', activity: '점심 약속' },
            { id: 2, name: '친구2', time: '15:30', activity: '카페에서 만나기' },
        ]);
    }, []);

    return (
        <div className="card">
            <h3>친구 일정 요약</h3>
            <ul>
                {schedules.map(item => (
                    <li key={item.id}>
                        {item.name}: {item.time} {item.activity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendSchedule;
