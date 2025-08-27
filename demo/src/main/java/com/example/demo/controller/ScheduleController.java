package com.example.demo.controller;

import com.example.demo.domain.Schedule;
import com.example.demo.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    
    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
    
    /**
     * 일정 생성
     */
    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(@RequestBody ScheduleCreateRequest request) {
        try {
            Schedule schedule = new Schedule(
                request.getTitle(),
                request.getDescription(),
                request.getStartTime(),
                request.getEndTime(),
                request.getCategory(),
                request.getPriority(),
                request.getMemberId()
            );
            
            Long scheduleId = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(new ScheduleResponse(scheduleId, "일정이 성공적으로 생성되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ScheduleResponse(null, e.getMessage()));
        }
    }
    
    /**
     * 모든 일정 조회
     */
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleService.findSchedules();
        return ResponseEntity.ok(schedules);
    }
    
    /**
     * 오늘의 일정 조회
     */
    @GetMapping("/today")
    public ResponseEntity<List<Schedule>> getTodaySchedules() {
        List<Schedule> schedules = scheduleService.findTodaySchedules();
        return ResponseEntity.ok(schedules);
    }
    
    /**
     * 이번 주 일정 조회
     */
    @GetMapping("/this-week")
    public ResponseEntity<List<Schedule>> getThisWeekSchedules() {
        List<Schedule> schedules = scheduleService.findThisWeekSchedules();
        return ResponseEntity.ok(schedules);
    }
    
    /**
     * 특정 회원의 일정 조회
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Schedule>> getSchedulesByMember(@PathVariable Long memberId) {
        List<Schedule> schedules = scheduleService.findSchedulesByMember(memberId);
        return ResponseEntity.ok(schedules);
    }
    
    /**
     * 일정 삭제
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ScheduleResponse> deleteSchedule(@PathVariable Long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return ResponseEntity.ok(new ScheduleResponse(scheduleId, "일정이 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ScheduleResponse(null, "일정 삭제에 실패했습니다."));
        }
    }
    
    // Request DTO
    public static class ScheduleCreateRequest {
        private String title;
        private String description;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String category;
        private String priority;
        private Long memberId;
        
        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        
        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        
        public Long getMemberId() { return memberId; }
        public void setMemberId(Long memberId) { this.memberId = memberId; }
    }
    
    // Response DTO
    public static class ScheduleResponse {
        private Long id;
        private String message;
        
        public ScheduleResponse(Long id, String message) {
            this.id = id;
            this.message = message;
        }
        
        public Long getId() { return id; }
        public String getMessage() { return message; }
    }
}
