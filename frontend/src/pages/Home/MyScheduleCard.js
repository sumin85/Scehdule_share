import React from "react";

const MyScheduleCard = ({ title, schedules = [] }) => {
    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return '#ff4757';
            case 'MEDIUM': return '#ffa502';
            case 'LOW': return '#2ed573';
            default: return '#747d8c';
        }
    };

    return (
        <div className="section">
            <h3>{title}</h3>
            <div className="card">
                {schedules.length === 0 ? (
                    <div className="schedule-placeholder">
                        <p style={{ color: '#747d8c', fontStyle: 'italic' }}>
                            등록된 일정이 없습니다.
                        </p>
                    </div>
                ) : (
                    <div className="schedule-list">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="schedule-item">
                                <div className="schedule-header">
                                    <span 
                                        className="priority-indicator"
                                        style={{ backgroundColor: getPriorityColor(schedule.priority) }}
                                    ></span>
                                    <h4 className="schedule-title">{schedule.title}</h4>
                                </div>
                                <div className="schedule-details">
                                    <div className="schedule-time">
                                        {formatDate(schedule.startTime)} {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                    </div>
                                    {schedule.description && (
                                        <p className="schedule-description">{schedule.description}</p>
                                    )}
                                    {schedule.category && (
                                        <span className="schedule-category">#{schedule.category}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyScheduleCard;