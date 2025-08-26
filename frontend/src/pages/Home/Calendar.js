import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
    return (
        <div className="calendar">
            <h3>📅 캘린더</h3>
            <div className="card">
                <FullCalendar 
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="auto"
                expandRows={true}
                handleWindowResize={true}
                events={[
                {title: '일정1', date: '2025-08-21', allDay: true},
                {title: '일정2', date: '2025-08-22', allDay: true},
                {title: '일정3', date: '2025-08-23', allDay: true},
                ]}
                />
            </div>
        </div>
    );
};

export default Calendar;