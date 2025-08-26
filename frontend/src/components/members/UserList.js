import React, { useState, useEffect } from 'react';

const UserList = ({ title }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // This will be replaced with actual API call
        // axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
        //     .then(response => setUsers(response.data))
        //     .catch(error => console.error("Error fetching users:", error));
        
        // Mock data for now
        setUsers([
            { id: 1, name: '사용자1', email: 'user1@example.com' },
            { id: 2, name: '사용자2', email: 'user2@example.com' },
        ]);
    }, []);

    return (
        <div className="card">
            <h3>{title}</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
