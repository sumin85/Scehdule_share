package com.example.demo.repository;

import com.example.demo.domain.Schedule;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class MemoryScheduleRepository implements ScheduleRepository {
    
    private static Map<Long, Schedule> store = new ConcurrentHashMap<>();
    private static long sequence = 0L;
    
    @Override
    public Schedule save(Schedule schedule) {
        schedule.setId(++sequence);
        store.put(schedule.getId(), schedule);
        return schedule;
    }
    
    @Override
    public Optional<Schedule> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }
    
    @Override
    public List<Schedule> findAll() {
        return new ArrayList<>(store.values());
    }
    
    @Override
    public List<Schedule> findByMemberId(Long memberId) {
        return store.values().stream()
                .filter(schedule -> Objects.equals(schedule.getMemberId(), memberId))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Schedule> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return store.values().stream()
                .filter(schedule -> 
                    schedule.getStartTime().isAfter(start.minusSeconds(1)) && 
                    schedule.getStartTime().isBefore(end.plusSeconds(1)))
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        store.remove(id);
    }
    
    public void clearStore() {
        store.clear();
    }
}
