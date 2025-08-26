import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Friend = () => {
  const monthLabel = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="friends-page">
      <div className="friends-top">
        {/* Left: Chips + Calendar */}
        <div className="left">
          <div className="friends-chips">
            <button className="chip">
              <span>친구 요청</span>
              <span className="count-badge">5개</span>
            </button>
            <button className="chip outline">친구 목록</button>
          </div>

          <div className="card calendar-card">
            <div className="calendar-header">
              <h3>{monthLabel}</h3>
              <button className="icon-btn" aria-label="편집">✎</button>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="auto"
              expandRows
              handleWindowResize
              events={[]}
            />
          </div>
        </div>

        {/* Right: Friend list panel */}
        <div className="right">
          <div className="panel card">
            <div className="panel-header">
              <input className="search" placeholder="친구 검색" />
              <button className="icon-btn" aria-label="검색">🔍</button>
            </div>
            <div className="panel-body">
              <ul className="friend-list">
                <li className="friend-item placeholder" />
                <li className="friend-item placeholder" />
                <li className="friend-item placeholder" />
                <li className="friend-item placeholder" />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Group notifications */}
      <div className="friends-bottom">
        <div className="section-title">👥 그룹 일정 알림</div>
        <div className="noti-grid">
          <div className="noti-card placeholder" />
          <div className="noti-card placeholder" />
          <div className="noti-card placeholder" />
          <div className="noti-card placeholder" />
          <div className="noti-card placeholder" />
        </div>
      </div>

      <button className="floating-add" aria-label="친구 추가">＋</button>
    </div>
  );
};

export default Friend;