import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const MySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/friends-schedules');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setSchedules(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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
        const d = parseDate(it.date || it.startDate || it.start);
        return d && d >= startOfToday && d < endOfToday;
      }),
    [schedules]
  );
  const weekList = useMemo(
    () =>
      schedules.filter((it) => {
        const d = parseDate(it.date || it.startDate || it.start);
        return d && d >= startOfToday && d < endOfWeek;
      }),
    [schedules]
  );

  const fmtDate = (d) =>
    new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const fmtTime = (d) => new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(d);

  const Item = ({ item }) => {
    const d = parseDate(item.date || item.startDate || item.start);
    const t = parseDate(item.time || item.startTime || item.start);
    const name = item.title || item.name || item.schedule || '제목 없음';
    return (
      <li className="schedule-item">
        <div className="title">{name}</div>
        {d && (
          <div className="meta">
            <span className="date">{fmtDate(d)}</span>
            <span className="time">{fmtTime(t || d)}</span>
          </div>
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
          </div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="auto"
            expandRows={true}
            handleWindowResize={true}
            events={[
              { title: '회의', date: '2025-08-17', allDay: true },
              { title: '개발', date: '2025-08-18', allDay: true },
            ]}
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
                  <Item key={idx} item={it} />
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
                  <Item key={idx} item={it} />
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
                  <Item key={idx} item={it} />
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