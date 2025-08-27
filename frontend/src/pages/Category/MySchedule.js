import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import scheduleService from '../../services/scheduleService';

const MySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAllSchedules();
      setSchedules(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  const parseDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const majorList = useMemo(() => schedules.slice(0, 3), [schedules]);
  const todayList = useMemo(
    () =>
      schedules.filter((it) => {
        const d = parseDate(it.startTime);
        return d && d >= startOfToday && d < endOfToday;
      }),
    [schedules]
  );
  const weekList = useMemo(
    () =>
      schedules.filter((it) => {
        const d = parseDate(it.startTime);
        return d && d >= startOfToday && d < endOfWeek;
      }),
    [schedules]
  );

  // 캘린더 이벤트 변환
  const calendarEvents = useMemo(() => {
    return schedules.map(schedule => ({
      id: schedule.id,
      title: schedule.title,
      start: schedule.startTime,
      end: schedule.endTime,
      allDay: false,
      backgroundColor: getPriorityColor(schedule.priority),
      borderColor: getPriorityColor(schedule.priority),
      textColor: '#fff'
    }));
  }, [schedules]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#ff4757';
      case 'MEDIUM': return '#ffa502';
      case 'LOW': return '#2ed573';
      default: return '#78509D';
    }
  };

  const fmtDate = (d) =>
    new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const fmtTime = (d) => new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(d);

  const Item = ({ item }) => {
    const d = parseDate(item.startTime);
    const name = item.title || '제목 없음';
    return (
      <li className="schedule-item">
        <div className="title">{name}</div>
        {d && (
          <div className="meta">
            <span className="date">{fmtDate(d)}</span>
            <span className="time">{fmtTime(d)}</span>
          </div>
        )}
        {item.description && (
          <div className="description">{item.description}</div>
        )}
      </li>
    );
  };

  return (
    <div className="my-schedule">
      {/* 상단 캘린더 카드 */}
      <div className="section">
        <div className="card calendar-card">
          <div className="calendar-header">
            <h3>📅 내 일정 캘린더</h3>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="auto"
            expandRows={true}
            handleWindowResize={true}
            events={calendarEvents}
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
          />
        </div>
      </div>

      {/* 하단 3열 일정 섹션 */}
      <div className="list-grid">
        <div className="list-section">
          <h4>🌟 주요일정</h4>
          <div className="card">
            {loading ? (
              <div className="schedule-placeholder" />
            ) : error ? (
              <div className="empty">불러오기 오류: {error}</div>
            ) : majorList.length === 0 ? (
              <div className="empty">예정된 일정이 없습니다</div>
            ) : (
              <ul className="schedule-list">
                {majorList.map((it, idx) => (
                  <Item key={it.id || idx} item={it} />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="list-section">
          <h4>🗓️ 오늘의 일정</h4>
          <div className="card">
            {loading ? (
              <div className="schedule-placeholder" />
            ) : error ? (
              <div className="empty">불러오기 오류: {error}</div>
            ) : todayList.length === 0 ? (
              <div className="empty">예정된 일정이 없습니다</div>
            ) : (
              <ul className="schedule-list">
                {todayList.map((it, idx) => (
                  <Item key={it.id || idx} item={it} />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="list-section">
          <h4>📅 이번 주 일정</h4>
          <div className="card">
            {loading ? (
              <div className="schedule-placeholder" />
            ) : error ? (
              <div className="empty">불러오기 오류: {error}</div>
            ) : weekList.length === 0 ? (
              <div className="empty">예정된 일정이 없습니다</div>
            ) : (
              <ul className="schedule-list">
                {weekList.map((it, idx) => (
                  <Item key={it.id || idx} item={it} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 추가 버튼 */}
      <button className="floating-add" aria-label="일정 추가">＋</button>
    </div>
  );
};

export default MySchedule;