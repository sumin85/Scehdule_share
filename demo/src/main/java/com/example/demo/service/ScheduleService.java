package com.example.demo.service;

import com.example.demo.domain.Schedule;
import com.example.demo.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    
    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }
    
    /**
     * 일정 생성
     */
    public Long createSchedule(Schedule schedule) {
        validateSchedule(schedule);
        Schedule savedSchedule = scheduleRepository.save(schedule);
        return savedSchedule.getId();
    }
    
    /**
     * 모든 일정 조회
     */
    public List<Schedule> findSchedules() {
        return scheduleRepository.findAll();
    }
    
    /**
     * 특정 회원의 일정 조회
     */
    public List<Schedule> findSchedulesByMember(Long memberId) {
        return scheduleRepository.findByMemberId(memberId);
    }
    
    /**
     * 날짜 범위로 일정 조회
     */
    public List<Schedule> findSchedulesByDateRange(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByDateRange(start, end);
    }
    
    /**
     * 오늘의 일정 조회
     */
    public List<Schedule> findTodaySchedules() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return scheduleRepository.findByDateRange(startOfDay, endOfDay);
    }
    
    /**
     * 이번 주 일정 조회
     */
    public List<Schedule> findThisWeekSchedules() {
        LocalDateTime startOfWeek = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return scheduleRepository.findByDateRange(startOfWeek, endOfWeek);
    }
    
    /**
     * 일정 삭제
     */
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
    
    /**
     * 일정 유효성 검증
     */
    private void validateSchedule(Schedule schedule) {
        if (schedule.getTitle() == null || schedule.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("일정 제목은 필수입니다.");
        }
        if (schedule.getStartTime() == null) {
            throw new IllegalArgumentException("시작 시간은 필수입니다.");
        }
        if (schedule.getEndTime() == null) {
            throw new IllegalArgumentException("종료 시간은 필수입니다.");
        }
        if (schedule.getStartTime().isAfter(schedule.getEndTime())) {
            throw new IllegalArgumentException("시작 시간은 종료 시간보다 빨라야 합니다.");
        }
    }
}
