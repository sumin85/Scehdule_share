package com.example.demo.repository;

import com.example.demo.domain.Schedule;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository {
    Schedule save(Schedule schedule);
    Optional<Schedule> findById(Long id);
    List<Schedule> findAll();
    List<Schedule> findByMemberId(Long memberId);
    List<Schedule> findByDateRange(LocalDateTime start, LocalDateTime end);
    void deleteById(Long id);
}
