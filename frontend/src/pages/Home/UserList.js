import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
            .then((res) => {
                console.log("응답 데이터:", res.data);
                setUsers(res.data);
            })
            .catch((err) => {
                console.error("유저가져오기 실패", err);
            });
    }, []);

    return (
        <div className="section">
            <h3>👤 유저 리스트</h3>
            <div className="card">
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} ({user.email})</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserList;

