import React from 'react';

const MyScheduleCard = ({ title }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <div className="schedule-placeholder">
                {title.includes('오늘') ? '오늘의 일정이 없습니다.' : '이번 주 일정이 없습니다.'}
            </div>
        </div>
    );
};

export default MyScheduleCard;
