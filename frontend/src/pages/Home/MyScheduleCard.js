import React from "react";

const MyScheduleCard = ({ title }) => (
    <div className="section">
        <h3>{title}</h3>
        <div className="card">
            <div className="schedule-placeholder"></div>
        </div>
    </div>
);

export default MyScheduleCard;