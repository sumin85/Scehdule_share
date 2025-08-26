import React from "react";
import FriendSchedule from "./FriendSchedule";
import GroupNotifications from "./GroupNotifications";
import MyScheduleCard from "./MyScheduleCard";
import UserList from "./UserList";
import Calendar from "./Calendar";

const Dashboard = () => (
  <div className="dashboard">
    <div className="column">
      <Calendar />
    </div>
    <div className="column">
      <MyScheduleCard title="📆 오늘의 일정" />
      <MyScheduleCard title="📅 이번 주 일정" />
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

export default Dashboard;