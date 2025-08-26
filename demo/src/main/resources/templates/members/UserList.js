import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ title }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("유저 목록을 불러오는데 실패했습니다:", error);
            });
    }, []);

    return (
        <div className="card">
            <h3>{title}</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
