import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
    return (
        <div className="card">
            <h3>📅 캘린더</h3>
            <FullCalendar 
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={[
                {title: '일정1', date: '2023-01-01', allDay: true},
                {title: '일정2', date: '2023-01-02', allDay: true},
                {title: '일정3', date: '2023-01-03', allDay: true},
            ]} />
        </div>
    );
};

export default Calendar;
