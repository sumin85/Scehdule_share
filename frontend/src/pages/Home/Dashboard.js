import React from "react";
import FriendSchedule from "./FriendSchedule";
import GroupNotifications from "./GroupNotifications";
import MyScheduleCard from "./MyScheduleCard";
import UserList from "./UserList";
import Calendar from "./Calendar";

const Dashboard = ({ schedules = [] }) => {
  // 오늘 일정 필터링
  const today = new Date();
  const todaySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startTime);
    return scheduleDate.toDateString() === today.toDateString();
  });

  // 이번 주 일정 필터링
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const thisWeekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startTime);
    return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
  });

  return (
    <div className="dashboard">
      <div className="column">
        <Calendar schedules={schedules} />
      </div>
      <div className="column">
        <MyScheduleCard title="📆 오늘의 일정" schedules={todaySchedules} />
        <MyScheduleCard title="📅 이번 주 일정" schedules={thisWeekSchedules} />
      </div>
      <div className="column">
        <FriendSchedule />
      </div>
      <div className="column">
        <GroupNotifications />
      </div>
      <div className="column">
        <UserList title="👤유저 리스트" />
      </div>
    </div>
  );
};

export default Dashboard;