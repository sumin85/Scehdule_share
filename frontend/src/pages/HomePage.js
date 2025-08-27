import React, { useState, useEffect } from "react";
import Dashboard from "./Home/Dashboard";
import FloatingButton from "../components/FloatingButton";
import ScheduleModal from "../components/ScheduleModal";
import scheduleService from "../services/scheduleService";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
    
    // 일정 데이터 로드
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const allSchedules = await scheduleService.getAllSchedules();
      setSchedules(allSchedules);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    }
  };

  const handleFloatingButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleScheduleSubmit = async (scheduleData) => {
    try {
      await scheduleService.createSchedule(scheduleData);
      setIsModalOpen(false);
      
      // 일정 목록 새로고침
      await loadSchedules();
      
      // 성공 메시지 (선택사항)
      alert('일정이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('일정 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <Dashboard schedules={schedules} />
      <FloatingButton onClick={handleFloatingButtonClick} />
      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleScheduleSubmit}
      />
    </div>
  );
}

export default HomePage;