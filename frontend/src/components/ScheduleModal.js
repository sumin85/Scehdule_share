import React, { useState } from 'react';
import './ScheduleModal.css';

const ScheduleModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    category: 'personal',
    priority: 'medium',
    memberId: 1 // 임시로 1로 설정
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.startTime || !formData.endTime) {
      alert('시작 시간과 종료 시간을 모두 입력해주세요.');
      return;
    }
    
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }
    
    // 백엔드 API 형식에 맞게 데이터 변환
    const scheduleData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startTime: formData.startTime, // datetime-local 형식 그대로 전송
      endTime: formData.endTime,
      category: formData.category,
      priority: formData.priority.toUpperCase(), // 대문자로 변환
      memberId: formData.memberId
    };
    
    console.log('Sending schedule data:', scheduleData); // 디버깅용
    
    onSubmit(scheduleData);
    
    // 폼 초기화
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      category: 'personal',
      priority: 'medium',
      memberId: 1
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 일정 추가</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="일정 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="일정 설명을 입력하세요"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">시작 시간 *</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">종료 시간 *</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="personal">개인</option>
                <option value="work">업무</option>
                <option value="study">학습</option>
                <option value="meeting">회의</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">우선순위</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
            <button type="submit" className="submit-button">
              일정 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
