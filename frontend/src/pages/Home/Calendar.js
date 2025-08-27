import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import scheduleService from '../../services/scheduleService';

const Calendar = ({ schedules = [] }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // schedules prop이 있으면 사용, 없으면 API에서 직접 가져오기
        if (schedules.length > 0) {
            const calendarEvents = schedules.map(schedule => ({
                id: schedule.id,
                title: schedule.title,
                start: schedule.startTime,
                end: schedule.endTime,
                allDay: false,
                backgroundColor: getPriorityColor(schedule.priority),
                borderColor: getPriorityColor(schedule.priority),
                textColor: '#fff'
            }));
            setEvents(calendarEvents);
        } else {
            // 백업: API에서 직접 가져오기
            loadSchedules();
        }
    }, [schedules]);

    const loadSchedules = async () => {
        try {
            const allSchedules = await scheduleService.getAllSchedules();
            const calendarEvents = allSchedules.map(schedule => ({
                id: schedule.id,
                title: schedule.title,
                start: schedule.startTime,
                end: schedule.endTime,
                allDay: false,
                backgroundColor: getPriorityColor(schedule.priority),
                borderColor: getPriorityColor(schedule.priority),
                textColor: '#fff'
            }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Failed to load schedules for calendar:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return '#ff4757';
            case 'MEDIUM': return '#ffa502';
            case 'LOW': return '#2ed573';
            default: return '#78509D';
        }
    };

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
                    events={events}
                    eventDisplay="block"
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                />
            </div>
        </div>
    );
};

export default Calendar;